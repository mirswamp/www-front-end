/******************************************************************************\
|                                                                              |
|                                   navbar-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing the top / side navbar navigation.   |
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
	'text!templates/layout/navbar.tpl',
	'registry',
	'collections/tools/tools',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, PopOver, Template, Registry, Tools, NotifyView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'click #side-nav': 'onClickSideNav'
		},

		setLayout: function(layout) {
			Registry.application.setLayout(layout);

			// refresh
			//
			var fragment = Backbone.history.fragment;
			Backbone.history.fragment = null;
			Backbone.history.navigate(fragment, true);
		},

		getOrientation: function() {
			var layout = Registry.application.options.layout;
			if (layout && layout.indexOf("bottom") > -1) {
				return 'bottom';
			} else {
				return 'top';
			}
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				nav: this.options.nav,
				showHome: this.options.showHome,
				orientation: this.getOrientation(),
				showChangeIcons: this.options.showChangeIcons,
				isAdmin: Registry.application.session.user.isAdmin()
			}));
		},

		onRender: function() {
			var self =  this;

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
						self.$el.find('#tools').closest('li').show();
					} else {
						self.$el.find('#tools').closest('li').hide();
					}
				}
			});
		},

		//
		// navbar positioning event handling methods
		//

		onClickSideNav: function() {
			this.setLayout('two-columns-left-sidebar');
		}
	});
});
