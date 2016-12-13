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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'popover',
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
			'click #packages': 'onClickPackages',
			'click #tools': 'onClickTools',
			'click #assessments': 'onClickAssessments',
			'click #results': 'onClickResults',
			'click #runs': 'onClickRuns',
			'click #projects': 'onClickProjects',
			'click #events': 'onClickEvents',
			'click #settings': 'onClickSettings',
			'click #overview': 'onClickOverview',
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
		// event handling methods
		//

		onClickPackages: function() {

			// go to my packages view
			//
			Backbone.history.navigate('#packages', {
				trigger: true
			});	
		},

		onClickTools: function() {

			// go to my tools view
			//
			Backbone.history.navigate('#tools', {
				trigger: true
			});	
		},

		onClickAssessments: function() {

			// go to my assessments view
			//
			Backbone.history.navigate('#assessments', {
				trigger: true
			});
		},

		onClickResults: function() {

			// go to my results view
			//
			Backbone.history.navigate('#results', {
				trigger: true
			});
		},

		onClickRuns: function() {

			// go to my scheduled runs view
			//
			Backbone.history.navigate('#run-requests', {
				trigger: true
			});
		},

		onClickProjects: function() {

			// go to my projects view
			//
			Backbone.history.navigate('#projects', {
				trigger: true
			});	
		},

		onClickEvents: function() {

			// go to my events view
			//
			Backbone.history.navigate('#events?project=any', {
				trigger: true
			});	
		},

		onClickSettings: function() {

			// go to settings view
			//
			Backbone.history.navigate('#settings', {
				trigger: true
			});			
		},

		onClickOverview: function() {

			// go to overview view
			//
			Backbone.history.navigate('#overview', {
				trigger: true
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
