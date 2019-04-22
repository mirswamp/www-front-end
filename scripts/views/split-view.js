/******************************************************************************\
|                                                                              |
|                                  split-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a split view.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'split/split'
], function($, _, Backbone, Marionette, Split) {
	'use strict';

	// pre-compile template
	//
	var _template = _.template('<div class="split sidebar"></div><div class="split mainbar"></div>');

	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _template,

		regions: {
			sidebar: {
				el: '.sidebar',
				replaceElement: false
			},
			content: {
				el: '.mainbar',
				replaceElement: false
			}
		},

		events: {
			'dblclick .gutter': 'onDoubleClickGutter'
		},

		// splitter sizes
		//
		sizes: [25, 75],
		prevSizes: [],
		minSize: 0,
		defaultOrientation: 'horizontal',

		//
		// constructor
		//

		initialize: function() {

			// set optional parameter defaults
			//
			if (this.options.orientation == undefined) {
				this.options.orientation = this.defaultOrientation;
			}
		},

		//
		// querying methods
		//

		getSizes: function() {
			return this.splitter.getSizes();
		},

		pixelsToPercent: function(sizes) {

			// convert sizes from pixels to percentages
			//
			for (var i = 0; i < sizes.length; i++) {
				if (typeof sizes[i] == 'string' && sizes[i].contains('px')) {
					sizes[i] = parseInt(sizes[i].replace('px', '')) / this.$el.width() * 100;
				}
			}

			// redistribute remaining width
			//
			var sum = 0;
			var num = 0;
			for (var i = 0; i < sizes.length; i++) {
				if (sizes[i]) {
					sum += sizes[i];
					num++;
				}
			}
			if (sum < 100) {
				var size = (100 - sum) / (sizes.length - num);
				for (var i = 0; i < sizes.length; i++) {
					if (!sizes[i]) {
						sizes[i] = size;
					}
				}
			}

			return sizes;
		},

		//
		// setting methods
		//

		resetSidebar: function() {
			this.splitter.setSizes(this.options.sizes || this.sizes);
			this.onResize();
		},

		//
		// sidebar opening / closing methods
		//

		openSidebar: function() {
			this.splitter.setSizes(this.prevSizes || this.options.sizes || this.sizes);
			this.onResize();
		},

		closeSidebar: function(options) {
			this.prevSizes = this.getSizes();
			this.splitter.setSizes([0, 100]);
		},

		//
		// sidebar hiding / showing methods
		//

		hideSidebar: function(options) {
			if (!this.splitter.hidden) {
				this.closeSidebar();
				this.$el.find('.gutter').hide();
				this.$el.find('.mainbar').css({
					'width': '100%',
					'height': '100%'
				});
				this.splitter.hidden = true;
			}
		},

		showSidebar: function() {
			if (this.splitter.hidden) {
				this.$el.find('.gutter').show();
				this.openSidebar();
				this.onResize();
				this.splitter.hidden = false;
			}
		},

		setOrientation: function(orientation) {
			switch (orientation) {
				case 'horizontal':
					this.$el.find('.split').addClass('split-horizontal').removeClass('split-vertical');
					break;
				case 'vertical':
					this.$el.find('.split').addClass('split-vertical').removeClass('split-horizontal');
					break;
			}		
		},

		//
		// rendering methods
		//

		onRender: function() {

			// clamp sizes to avoid slight layout error
			//
			if (this.options.sizes) {
				if (this.options.sizes[0] == 0 && this.options.sizes[1] == 100) {
					this.options.sizes[1] = 99;
				}
			}

			// show splitter
			//
			if (!this.splitter) {
				this.setOrientation(this.options.orientation);
				this.splitter = Split([this.$el.find('.sidebar')[0], this.$el.find('.mainbar')[0]], {
					direction: this.options.orientation,
					sizes: this.options.sizes || this.sizes,
					minSize: this.minSize
				});
			}
			
			// show child views
			//
			if (this.sidebarView) {
				this.sidebar.show(this.sidebarView());
			}
			if (this.contentView) {
				this.mainbar.show(this.contentView());
			}
		},

		onDoubleClickGutter: function() {
			this.resetSidebar();
		},

		onResize: function() {

			// apply to child views
			//
			if (this.sidebar && this.sidebar.onResize) {
				this.sidebar.onResize();
			}
			if (this.mainbar && this.mainbar.onResize) {
				this.mainbar.onResize();
			}
		},

		onKeyDown: function(event) {

			// check menu keyboard shortcuts
			//
			if (this.sidebar && this.sidebar.onKeyDown) {
				this.sidebar.onKeyDown(event);
			}
			if (this.mainbar && this.mainbar.onKeyDown) {
				this.mainbar.onKeyDown(event);
			}
		}
	});
});