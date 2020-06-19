/******************************************************************************\
|                                                                              |
|                              multi-column-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the layout for a multi-column (sidebar + main) view.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/layout/multi-column.tpl',
	'models/projects/project',
	'views/base-view',
	'views/layout/sidebar-view'
], function($, _, Template, Project, BaseView, SidebarView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		className: 'home container',

		regions: {
			side_column: '.side.column',
			main_column: '.main.column',
			sidebar: '.side.column #sidebar',
			content: '.main.column .content'	
		},

		//
		// contructor
		//

		initialize: function() {

			// set optional parameter defaults
			//
			if (this.options.navbarOrientation == undefined) {
				this.options.navbarOrientation = 'left';
			}
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;
			
			// fetch the trial project
			//
			var project = new Project();
			project.fetchCurrentTrial({

				// callbacks
				//
				success: function(data) {
					self.model = new Project(data);
					self.showSidebar(self.model);

					// perform callback
					//
					if (self.options.done) {
						self.options.done(self);
					}
				},

				error: function() {
					application.error({
						message: 'Could not fetch trial project for this user.'
					});
				}
			});

			// set orientation
			//
			this.$el.addClass(this.options.navbarOrientation);

			// set number of columns
			//
			if (this.options.navbarOrientation == 'left' ||
				this.options.navbarOrientation == 'right') {
				this.$el.addClass('two-column');
			}
		},

		showSidebar: function(trialProject) {
			this.showChildView('sidebar', new SidebarView({
				model: trialProject,
				nav: this.options.nav,
				size: this.options.navbarSize
			}));

			this.onShowSidebar();
		},

		onShowSidebar: function() {
			var self = this;

			// save sidebar height
			//
			this.sidebarTop = this.getChildView('sidebar').$el.position().top;
			this.sidebarHeight = this.getChildView('sidebar').$el.height();

			// set updating
			//
			this.onResizeHandler =  $(window).resize(function() {
				self.onResize();
			});

			// make side column fixed
			//
			this.affixSideColumn();
		},

		affixSideColumn: function() {
			var self = this;
			var sideColumn = this.$el.find('.side.column')[0];

			// reset sidebar position after scroll
			//
			this.eventListener = window.addEventListener('scroll', function() {
				var layout = application.getLayout();
				var orientation = application.getLayoutOrientation(layout);

				if (orientation == 'left' || orientation == 'right') {
					$(sideColumn).css('margin-top', window.pageYOffset);
				}
			});
		},

		getPlaceholder: function(element) {
			var position = element.getBoundingClientRect();
			var placeholder = document.createElement('div');
			placeholder.style.width = position.width + 'px';
			placeholder.style.height = position.height + 'px';
			$(placeholder).attr('class', $(element).attr('class'));
			placeholder.style.position = 'relative';
			return placeholder;
		},

		adjustMainColumn: function() {
			if (!this.isDestroyed) {

				// set main column to be at least as tall as side column
				//
				this.mainColumn.$el.css('min-height', this.sideColumn.$el.height());
			}
		},

		onResize: function() {
			var self = this;

			// adjust column heights
			//
			this.adjustMainColumn();
			
			// wait 100ms for resize to stop before re-apply affix
			//
			if (this.resizeTimeout) {
				clearTimeout(this.resizeTimeout);
			}
		},

		//
		// event handling methods
		//

		onKeyDown: function(event) {

			// check for child view
			//
			if (!this.hasChildView('content')) {
				return;
			}

			if (this.getChildView('content').onKeyDown) {

				// let view handle event
				//
				this.getChildView('content').onKeyDown(event);

			// if return key is pressed, then trigger primary button
			//
			} else if (event.keyCode == 13 && event.target.type != 'textarea') {

				// find primary button
				//
				if (this.getChildView('content')) {
					var button = this.getChildView('content').$el.find('.btn-primary')[0];

					if (button) {

						// activate primary button
						//
						$(button).trigger('click');

						// prevent further handling of event
						//
						event.stopPropagation();
						event.preventDefault();		
					}
				}
			}
		},

		onDestroy: function() {
			$(window).off('resize', this.onResizeHandler);
			$(window).off('scroll', this.onScrollHandler);
		}
	});
});
