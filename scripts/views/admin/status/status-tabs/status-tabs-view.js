/******************************************************************************\
|                                                                              |
|                               status-tabs-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for displaying the current system status.       |
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
	'bootstrap/tab',
	'text!templates/admin/status/status-tabs/status-tabs.tpl',
	'registry',
	'views/admin/status/uuid-item-list/uuid-item-list-view',
	'views/admin/status/uuid-item-select-list/uuid-item-select-list-view'
], function($, _, Backbone, Marionette, Tab, Template, Registry, UuidItemListView, UuidItemSelectListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		events: {
			'click a[role="tab"]': 'onClickTab',
		},

		//
		// rendering methods
		//

		template: function(data) {

			// check if active tab is not found in list of tabs
			//
			if (this.options.activeTab) {	
				if (!this.options.data[this.options.activeTab]) {
					this.options.activeTab = undefined;
				}
			}
		 		
			return _.template(Template, _.extend(data, {
				tabs: Object.keys(this.options.data),
				activeTab: this.options.activeTab
			}));
		},

		onRender: function() {

			// show status header info
			//
			this.showTabs(this.options.data);
		},

		showTabs: function(data) {
			if (!data) {
				return;
			}

			var tabs = Object.keys(data);
			for (var i = 0; i < tabs.length; i++) { 
				var tab = tabs[i];
				var id = tab.replace(/ /g, '_').toLowerCase() + '-panel';
				var region = this.addRegion(tab, '#' + id);	
				var object = data[tab];	
				if (object) {
					var keys = Object.keys(object); 
					if (keys.length > 0) {	
						var item = object[keys[0]]; 
						if ((tab == "Assessment Queue") || (tab == "Metric Queue") || (tab == "Viewer Queue")) {
							region.show(new UuidItemSelectListView({
								fieldnames: item.fieldnames,
								collection: new Backbone.Collection(item.data),
								showNumbering: Registry.application.options.showNumbering,
								sortList: this.options.tabState[tab] ? this.options.tabState[tab].sortList : undefined,
								selected: this.options.tabState[tab] ? this.options.tabState[tab].selected : undefined
							}));
						} else {
							region.show(new UuidItemListView({
								fieldnames: item.fieldnames,
								collection: new Backbone.Collection(item.data),
								showNumbering: Registry.application.options.showNumbering,
								sortList: this.options.tabState[tab] ? this.options.tabState[tab].sortList : undefined
							}));
						}
					}
				}				
			}
		},

		//
		// event handling methods
		//

		onClickTab: function(event) {
			this.options.parent.options.activeTab = $(event.target).closest('li').find('span').html();
		}
	});
});
