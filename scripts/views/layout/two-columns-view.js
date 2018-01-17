/******************************************************************************\
|                                                                              |
|                                two-columns-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the layout for a two column (sidebar + main) view.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/layout/two-columns-left-sidebar.tpl',
	'text!templates/layout/two-columns-right-sidebar.tpl',
	'registry',
	'models/projects/project',
	'views/layout/sidebar-view'
], function($, _, Backbone, Marionette, TemplateLeftSidebar, TemplateRightSidebar, Registry, Project, SidebarView) {

	//
	// method for hierarchically setting attributes of views
	//

	function setViewRegionOnShowCallback(view, callback) {

		// set region attribute of subviews
		//
		if (view.getRegions) {
			var regions = view.getRegions();
			for (var key in regions) {
				setRegionOnShowCallback(regions[key], callback);
			}
		}
	}

	function unsetViewRegionOnShowCallback(view) {

		// set region attribute of subviews
		//
		if (view.getRegions) {
			var regions = view.getRegions();
			for (var key in regions) {
				unsetRegionOnShowCallback(regions[key]);
			}
		}
	}

	function setRegionOnShowCallback(region, callback) {
		if (region.currentView) {

			// region has already been shown
			//
			setViewRegionOnShowCallback(region.currentView, callback);
		} else {

			// region has not been shown yet
			//
			region.onShow = function() {
				callback();

				// set callback of region's subviews
				//
				setViewRegionOnShowCallback(this.currentView, callback);
			}

			region.onDestroy = function() {

				// unset callback of region's subviews
				//
				unsetViewRegionOnShowCallback(this.currentView);			
			}
		}
	}

	function unsetRegionOnShowCallback(region) {
		if (region.currentView) {

			// region has already been shown
			//
			unsetViewRegionOnShowCallback(region.currentView);
		}

		// region has not been shown yet
		//
		region.onShow = undefined;
	}

	var regions = {
		sideColumn: '.side.column',
		mainColumn: '.main.column',
		sidebar: '.side.column #sidebar',
		content: '.main.column .content'
	}

	// create view
	//
	return Backbone.Marionette.LayoutView.extend({

		//
		// rendering methods
		//

		template: function(data) {

			// use right or left template
			//
			switch (this.options.navbarOrientation) {
				case 'left':
					var template = TemplateLeftSidebar;
					break;
				case 'right':
					var template = TemplateRightSidebar;
					break;
				default:
					var template = TemplateLeftSidebar;
			}

			return _.template(template);
		},

		onRender: function() {
			var self = this;

			// create regions
			//
			self.addRegions(regions);
			
			// fetch the trial project
			//
			var project = new Project();
			project.fetchCurrentTrial({

				// callbacks
				//
				success: function(data) {
					self.model = new Project(data);
					self.showSidebar(self.model);
				},

				error: function() {
					Registry.application.error({
						message: 'Could not fetch trial project for this user.'
					});
				}
			});
		},

		showSidebar: function(trialProject) {
			if (this.sidebar) {
				this.sidebar.show(
					new SidebarView({
						model: trialProject,
						nav: this.options.nav,
						size: this.options.navbarSize
					})
				);

				this.onShowSidebar();
			}
		},

		onShowSidebar: function() {
			var self = this;

			// save sidebar height
			//
			this.sidebarTop = this.sidebar.$el.position().top;
			this.sidebarHeight = this.sidebar.$el.height();

			// set updating
			//
			this.onResizeHandler =  $(window).resize(function() {
				self.onResize();
			});
			this.onScrollHandler = $(window).scroll(function() {
				self.onScroll();
			});

			// add callbacks to content region's views
			//
			setRegionOnShowCallback(self.content, function() {
				self.adjustMainColumn();
			});

			// adjust column heights
			//
			self.adjustMainColumn();

			// make side column fixed
			//
			this.affixSideColumn();

			// perform callback
			//
			if (this.options.done) {
				this.options.done(this);
			}
		},

		affixSideColumn: function() {
			var sideColumn = this.$el.find('.side.column')[0];
			var sidebar = this.$el.find('#sidebar')[0];

			// set side column to fixed position
			//
			if (this.options.navbarOrientation == 'left') {
				var placeholder = this.getPlaceholder(sideColumn);
				var isAdded = false;
				window.addEventListener('scroll', function() {
					if (window.pageYOffset > 0 && !isAdded) {
						$(sideColumn).css('position', 'fixed');
						sideColumn.parentNode.insertBefore(placeholder, sideColumn);
						isAdded = true;
					} else if (window.pageYOffset <= 0 && isAdded) {
						$(sideColumn).css('position', 'static');
						sideColumn.parentNode.removeChild(placeholder);
						isAdded = false;
					}
				});
			}
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

			this.resizeTimeout = setTimeout(function() {
				self.onScroll();
			}, 100);
		},

		onScroll: function() {
			if (!this.isDestroyed) {
				var contentHeight = this.$el.height();
				var scrollDistance = $(window).scrollTop();
				var contentTop = this.$el.position().top;

				// find position of bottom of document
				//
				var bottomOffset = contentHeight - scrollDistance - this.sidebarTop + contentTop;

				// adjust padding to keep sidebar fixed
				//
				if (this.options.navbarOrientation == 'right') {
					var mainColumn = this.$el.find('.main.column')[0];
					var sideColumn = this.$el.find('.side.column')[0];
					
					var scroll = $(window).scrollTop();
					if (scroll < $(mainColumn).height() - $(sideColumn).height()) {
						$(sideColumn).css({
							'padding-top': $(window).scrollTop() + 20
						});
					}
				}

				// check if sidebar hits bottom
				//
				if (bottomOffset < this.sidebarHeight) {
					this.sidebar.$el.css({
						'margin-top': (bottomOffset - this.sidebarHeight)
					});
				}
			}
		},

		//
		// event handling methods
		//

		onKeyDown: function(event) {
			if (this.content.currentView.onKeyDown) {

				// let view handle event
				//
				this.content.currentView.onKeyDown(event);

			// if return key is pressed, then trigger primary button
			//
			} else if (event.keyCode == 13) {
				if (this.content.currentView && this.content.currentView.$el.find('.btn-primary').length > 0) {

					// let content handle event
					//
					this.content.currentView.$el.find('.btn-primary').trigger('click');

					// finish handling event
					//
					event.stopPropagation();
					event.preventDefault();
				}
			}
		},

		onDestroy: function() {
			$(window).off('resize', this.onResizeHandler);
			$(window).off('scroll', this.onScrollHandler);
		}
	});
});
