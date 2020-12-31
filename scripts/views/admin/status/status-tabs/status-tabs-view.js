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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/tab',
	'text!templates/admin/status/status-tabs/status-tabs.tpl',
	'views/base-view',
	'views/admin/status/uuid-item-list/uuid-item-list-view',
	'views/admin/status/uuid-item-select-list/uuid-item-select-list-view'
], function($, _, Tab, Template, BaseView, UuidItemListView, UuidItemSelectListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click a[role="tab"]': 'onClickTab',
		},

		//
		// rendering methods
		//

		templateContext: function() {

			// check if active tab is not found in list of tabs
			//
			if (this.options.activeTab) {	
				if (!this.options.data[this.options.activeTab]) {
					this.options.activeTab = undefined;
				}
			}
		 		
			return {
				tabs: Object.keys(this.options.data),
				activeTab: this.options.activeTab
			};
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
								sortBy: this.options.tabState[tab] ? this.options.tabState[tab].sortBy : undefined,
								selected: this.options.tabState[tab] ? this.options.tabState[tab].selected : undefined
							}));
						} else {
							region.show(new UuidItemListView({
								fieldnames: item.fieldnames,
								collection: new Backbone.Collection(item.data),
								sortBy: this.options.tabState[tab] ? this.options.tabState[tab].sortBy : undefined
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
