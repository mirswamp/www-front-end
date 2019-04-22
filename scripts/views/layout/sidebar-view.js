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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'bootstrap/popover',
	'text!templates/layout/sidebar.tpl',
	'text!templates/layout/sidebar-large.tpl',
	'text!templates/layout/navbar.tpl',
	'registry',
	'collections/tools/tools',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, PopOver, Sidebar, SidebarLarge, Navbar, Registry, Tools, NotifyView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'click #maximize-nav': 'onClickMaximizeNav',
			'click #minimize-nav': 'onClickMinimizeNav',
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
			var currentLayout = Registry.application.getLayout();
			var currentOrientation = Registry.application.getLayoutOrientation(currentLayout);
			var orientation = Registry.application.getLayoutOrientation(layout);

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
			Registry.application.setLayout(layout);

			// update sidebar
			//
			this.render();
		},

		//
		// rendering methods
		//

		template: function(data) {
			var layout = Registry.application.getLayout();
			var orientation = Registry.application.getLayoutOrientation(layout);
			var template;

			// get appropriate template
			//
			switch (orientation || 'left') {
				case 'top':
				case 'bottom':
					template = Navbar;
					break;

				case 'right':
				case 'left':
					template = this.options.size == 'large'? SidebarLarge : Sidebar;
					break;
			}

			return _.template(template, _.extend(data, {
				nav: this.options.nav,
				showHome: this.options.showHome,
				orientation: orientation,
				isAdmin: Registry.application.session.user.isAdmin()
			}));
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
			Tools.fetchNumByUser(Registry.application.session.user, {
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
		// navbar positioning event handling methods
		//

		onClickMaximizeNav: function() {

			// clear popovers
			//
			$(".popover").remove();

			// set layout
			//
			if (Registry.application.options.layout == 'two-columns-right-sidebar') {
				this.setLayout('two-columns-right-sidebar-large');
			} else {
				this.setLayout('two-columns-left-sidebar-large');
			}
		},

		onClickMinimizeNav: function() {

			// clear popovers
			//
			$(".popover").remove();

			// set layout
			//
			if (Registry.application.options.layout == 'two-columns-right-sidebar-large') {
				this.setLayout('two-columns-right-sidebar');
			} else {
				this.setLayout('two-columns-left-sidebar');
			}
		},

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
