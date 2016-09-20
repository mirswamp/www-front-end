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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'popover',
	'text!templates/layout/sidebar.tpl',
	'text!templates/layout/sidebar-large.tpl',
	'registry',
	'collections/tools/tools',
	'views/dialogs/notify-view'
], function($, _, Backbone, Marionette, PopOver, Template, TemplateLarge, Registry, Tools, NotifyView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'click #home': 'onClickHome',
			'click #packages': 'onClickPackages',
			'click #tools': 'onClickTools',
			'click #assessments': 'onClickAssessments',
			'click #results': 'onClickResults',
			'click #runs': 'onClickRuns',
			'click #projects': 'onClickProjects',
			'click #events': 'onClickEvents',
			'click #settings': 'onClickSettings',
			'click #overview': 'onClickOverview',
			'click #maximize-nav': 'onClickMaximizeNav',
			'click #minimize-nav': 'onClickMinimizeNav',
			'click #top-nav': 'onClickTopNav',
			'click #bottom-nav': 'onClickBottomNav',
			'click #left-nav': 'onClickLeftNav',
			'click #right-nav': 'onClickRightNav'
		},

		//
		// methods
		//

		setLayout: function(layout) {
			Registry.application.setLayout(layout);

			// refresh
			//
			var fragment = Backbone.history.fragment;
			Backbone.history.fragment = null;
			Backbone.history.navigate(fragment, true);
		},

		getOrientation: function() {
			var layout = Registry.application.layout;
			if (layout && layout.indexOf("right") > -1) {
				return 'right';
			} else {
				return 'left';
			}
		},

		//
		// rendering methods
		//

		template: function(data) {
			if (this.options.size != 'large') {
				var template = Template;
			} else {
				var template = TemplateLarge;
			}

			return _.template(template, _.extend(data, {
				nav: this.options.nav,
				showHome: this.options.showHome,
				orientation: this.getOrientation(),
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
		// event handling methods
		//

		onClickHome: function() {

			// clear popovers
			//
			$(".popover").remove();

			// go to my packages view
			//
			Backbone.history.navigate('#home', {
				trigger: true
			});	
		},

		onClickPackages: function() {

			// clear popovers
			//
			$(".popover").remove();

			// go to my packages view
			//
			Backbone.history.navigate('#packages', {
				trigger: true
			});	
		},

		onClickTools: function() {

			// clear popovers
			//
			$(".popover").remove();

			// go to my tools view
			//
			Backbone.history.navigate('#tools', {
				trigger: true
			});	
		},

		onClickAssessments: function() {

			// clear popovers
			//
			$(".popover").remove();

			// go to my assessments view
			//
			Backbone.history.navigate('#assessments', {
				trigger: true
			});
		},

		onClickResults: function() {

			// clear popovers
			//
			$(".popover").remove();

			// go to my results view
			//
			Backbone.history.navigate('#results', {
				trigger: true
			});
		},

		onClickRuns: function() {

			// clear popovers
			//
			$(".popover").remove();

			// go to my scheduled runs view
			//
			Backbone.history.navigate('#run-requests', {
				trigger: true
			});
		},

		onClickProjects: function() {

			// clear popovers
			//
			$(".popover").remove();

			// go to my projects view
			//
			Backbone.history.navigate('#projects', {
				trigger: true
			});	
		},

		onClickEvents: function() {

			// clear popovers
			//
			$(".popover").remove();

			// go to my events view
			//
			Backbone.history.navigate('#events?project=any', {
				trigger: true
			});	
		},

		onClickSettings: function() {

			// clear popovers
			//
			$(".popover").remove();

			// go to system settings view
			//
			Backbone.history.navigate('#settings', {
				trigger: true
			});			
		},

		onClickOverview: function() {

			// clear popovers
			//
			$(".popover").remove();

			// go to system overview view
			//
			Backbone.history.navigate('#overview', {
				trigger: true
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
			if (Registry.application.layout == 'two-columns-right-sidebar') {
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
			if (Registry.application.layout == 'two-columns-right-sidebar-large') {
				this.setLayout('two-columns-right-sidebar');
			} else {
				this.setLayout('two-columns-left-sidebar');
			}
		},

		onClickTopNav: function() {

			// clear popovers
			//
			$(".popover").remove();

			// set layout
			//
			this.setLayout('one-column-top-navbar');
		},

		onClickBottomNav: function() {

			// clear popovers
			//
			$(".popover").remove();

			// set layout
			//
			this.setLayout('one-column-bottom-navbar');
		},

		onClickLeftNav: function() {

			// clear popovers
			//
			$(".popover").remove();

			// set layout
			//
			if (this.options.size == 'large') {
				this.setLayout('two-columns-left-sidebar-large');
			} else {
				this.setLayout('two-columns-left-sidebar');
			}
		},

		onClickRightNav: function() {

			// clear popovers
			//
			$(".popover").remove();

			// set layout
			//
			if (this.options.size == 'large') {
				this.setLayout('two-columns-right-sidebar-large');
			} else {
				this.setLayout('two-columns-right-sidebar');
			}
		}
	});
});
