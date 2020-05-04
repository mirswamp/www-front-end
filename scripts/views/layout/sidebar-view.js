/******************************************************************************\
|                                                                              |
|                                 sidebar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing the sidebar navigation view.        |
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
	'bootstrap/popover',
	'text!templates/layout/sidebar.tpl',
	'text!templates/layout/navbar.tpl',
	'collections/tools/tools',
	'views/base-view',
	'utilities/web/query-strings'
], function($, _, PopOver, Sidebar, Navbar, Tools, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		events: {
			'click a': 'onClickLink',
			'click #top-nav': 'onClickTopNav',
			'click #bottom-nav': 'onClickBottomNav',
			'click #left-nav': 'onClickLeftNav',
			'click #right-nav': 'onClickRightNav',
			'click #side-nav': 'onClickSideNav'
		},

		//
		// methods
		//

		setLayout: function(layout) {
			var currentLayout = application.getLayout();
			var currentOrientation = application.getLayoutOrientation(currentLayout);
			var orientation = application.getLayoutOrientation(layout);

			// set orientation
			//
			$('.home.container').removeClass(currentOrientation);
			$('.home.container').addClass(orientation);

			// set number of columns
			//
			if (orientation == 'left' || orientation == 'right') {
				$('.home.container').addClass('two-column');
			} else {
				$('.home.container').removeClass('two-column');
			}

			// reset sidebar margin
			//
			switch (orientation || 'left') {
				case 'left':
				case 'right':
					$('.side.column').css('margin-top', window.pageYOffset);
					break;

				case 'top':
				case 'bottom':
					$('.side.column').css('margin-top', 0);
					break;
			}

			// save new layout
			//
			application.setLayout(layout);

			// update sidebar
			//
			this.render();
		},

		//
		// rendering methods
		//

		getTemplate: function() {
			var layout = application.getLayout();
			var orientation = application.getLayoutOrientation(layout);
			var template;

			// get appropriate template
			//
			if (orientation == 'top' || orientation == 'bottom') {
				template = Navbar;
			} else {
				template = Sidebar;
			}

			return _.template(template);
		},

		templateContext: function() {
			var layout = application.getLayout();
			var orientation = application.getLayoutOrientation(layout);

			return {
				nav: this.options.nav,
				orientation: orientation,
				isAdmin: application.session.user.isAdmin(),
				queryString: getQueryString()
			};
		},

		onRender: function() {
			var self = this;

			// clear popovers
			//
			$(".popover").remove();
			
			// initialize popovers
			//
			this.$el.find(".active").popover({
				trigger: 'hover',
				animation: true
			});

			// show tools, if necessary
			//
			Tools.fetchNumByUser(application.session.user, {
				success: function(number) {
					if (number > 0) {
						self.$el.find("#tools").show();
					} else {
						self.$el.find("#tools").hide();
					}
				}
			});
		},

		//
		// event handling methods
		//

		onClickLink: function(event) {
			var href = $(event.target).closest('a').attr('href');
		
			// prevent default link handling
			//
			event.stopPropagation();
			event.preventDefault();

			// go to view
			//
			application.navigate(href);
		},

		//
		// navbar positioning event handling methods
		//

		onClickTopNav: function() {
			this.setLayout('one-column-top-navbar');
		},

		onClickBottomNav: function() {
			this.setLayout('one-column-bottom-navbar');
		},

		onClickLeftNav: function() {
			this.setLayout('two-columns-left-sidebar');
		},

		onClickRightNav: function() {
			this.setLayout('two-columns-right-sidebar');
		},

		onClickSideNav: function() {
			this.setLayout('two-columns-left-sidebar');
		}
	});
});
