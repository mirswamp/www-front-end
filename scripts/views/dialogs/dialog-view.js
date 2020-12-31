/******************************************************************************\
|                                                                              |
|                                 dialog-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an base class for displaying modal dialogs.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/modal',
	'text!templates/dialogs/modal-dialog.tpl',
	'views/base-view',
	'views/dialogs/behaviors/positioning',
	'views/dialogs/behaviors/dragging',
	'views/dialogs/behaviors/resizing',
	'utilities/web/browser',
	'utilities/scripting/array-utils'
], function($, _, Modal, Template, BaseView, Positioning, Dragging, Resizing, Browser) {
	'use strict';

	return BaseView.extend(_.extend(Positioning, Dragging, Resizing, {

		//
		// attributes
		//

		className: 'focused modal',
		size: undefined,

		// flags
		//
		modal: true,
		draggable: true,
		resizable: false,

		attributes: {
			'role': 'dialog',
			'tabindex': -1,

			// prevents dialogs from closing with a
			// click outside of the dialog bounds
			//
			'data-backdrop': 'static'
		},

		events: {
			'dblclick .modal-header .handle': 'onDoubleClickHandle',
			'keydown': 'onKeyDown'
		},

		//
		// setting metods
		//

		setIcon: function(icon) {
			this.$el.find('.modal-title i').attr('class', icon);
		},

		setTitle: function(title) {
			this.$el.find('.modal-title h1').text(title);
		},

		//
		// show / hide methods
		//

		show: function() {
			this.constructor.dialogs.push(this);

			// render to DOM
			//
			$('body').append(this.render());

			// fire attach event
			//
			this.trigger('attach');

			// trigger plug-in
			//
			this.$el.modal({
				show: true,
				keyboard: false,
				backdrop: false
			});
		},

		hide: function() {

			// trigger plug-in
			//
			this.$el.modal('hide');
		},

		//
		// open / close methods
		//

		open: function(options) {
			var self = this;
			this.$el.addClass('opening');

			// center vertically
			//
			this.$el.css('display', 'flex');

			// focus when opened
			//
			window.setTimeout(function() {
				self.$el.removeClass('opening');
				self.focus();

				// perform callback
				//
				if (options && options.done) {
					options.done();
				}
			}, this.constructor.transitionDuration);
		},

		isClosing: function() {
			return this.$el.hasClass('closing');
		},

		//
		// focusing methods
		//

		focus: function() {
			this.$el.find('.modal-dialog').addClass('focused');
		},

		blur: function() {
			this.$el.find('.modal-dialog').removeClass('focused');
		},

		isFocused: function() {
			return this.$el.find('.modal-dialog').hasClass('focused');
		},

		//
		// rendering methods
		//

		getTemplate: function() {
			var data = this.templateContext? this.templateContext() : {};
			var template = Template.replace('<%= content %>', this.template(data));
			return _.template(template);
		},

		render: function() {
			var self = this;

			// call superclass method
			//
			var element = BaseView.prototype.render.call(this);

			// add buttons
			//
			if (this.buttons) {
				this.$el.find('.modal-header').prepend(this.buttons().render().$el);
			}

			// enable window features
			//
			if (this.draggable && !Browser.isMobile()) {
				this.enableDrag();
			}
			if (this.resizable && !Browser.isMobile()) {
				this.enableResize();
			}

			// set window size
			//
			if (this.width) {
				this.$el.find('.modal-dialog').css('width', this.width + 'px');
			}
			if (this.height) {
				this.$el.find('.modal-dialog').css('height', this.height + 'px');
			}

			// set up callbacks
			//
			this.$el.on('show.bs.modal', function(event) {
				self.onShow(event);
			});
			this.$el.on('hide.bs.modal', function(event) {
				self.onHide(event);
			});

			// add modal extents wrapping div
			//
			if (this.maxHeight || this.options.maxHeight) {
				this.$el.find('.modal-dialog').wrap($('<div class="modal-extents">').css({
					'min-height': this.maxHeight || this.options.maxHeight
				}));
			}

			return element;
		},

		//
		// event handling methods
		//

		onShow: function() {
			var self = this;

			// blur parent
			//
			if (this.opener && this.opener.blur) {
				this.opener.blur();
			}

			// notify child views
			//
			var regionNames = Object.keys(this.regions);
			for (var i = 0; i < regionNames.length; i++) {
				var childView = this.getChildView(regionNames[i]);
				if (childView && childView.onShow) {
					childView.onShow();
				}
			}

			// perform opening animation
			//
			this.open({

				// callbcks
				//
				done: function() {
					self.onShown();
				}
			});
		},

		onShown: function() {

			// show backdrop
			//
			if (this.modal) {
				this.$el.addClass('backdrop');
			}
			
			// focus form
			//
			if (this.hasChildView('form')) {
				this.getChildView('form').focus();
			}

			// perform callback
			//
			if (this.options.onShown) {
				this.options.onShown();
			}
		},

		onHide: function(event) {
			var self = this;
			this.$el.addClass('closing');

			// undo bootstrap adjustments
			//
			$('body').removeClass('modal-open');
			$('body').css('padding-left', '');
			$('body').css('padding-right', '');
			
			window.setTimeout(function() {
				self.destroy();
				self.onHidden();
			}, this.constructor.transitionDuration - 100);

			// prevent further handling of event
			//
			event.stopPropagation();
			event.preventDefault();
		},

		onHidden: function(event) {
			this.destroy();

			// perform callback
			//
			if (this.options.onHidden) {
				this.options.onHidden();
			}
		},

		onDoubleClickHandle: function() {
			this.resetPosition();
		},

		onKeyDown: function(event) {
			
			// trigger primary buttons
			//
			if (event.keyCode == 13 && this.$el.find('.btn-primary')) {
				this.$el.find('.btn-primary').trigger('click');

				// prevent further handling of event
				//
				event.stopPropagation();
				event.preventDefault();
			}

			// delegate key events to modal content
			//
			var view = this.getChildView('content');
			if (view && view.onKeyDown) {
				view.onKeyDown(event);
			}
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			this.$el.remove();

			// remove from stack
			//
			this.constructor.dialogs.pop();

			// remove backdrops
			//
			$('.modal-backdrop').remove();
		}
	}), {

		// stack of dialogs
		//
		dialogs: [],

		//
		// static attributes
		//

		transitionDuration: 300
	});
});
