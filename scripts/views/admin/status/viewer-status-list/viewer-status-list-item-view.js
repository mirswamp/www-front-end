/******************************************************************************\
|                                                                              |
|                          viewer-status-list-item-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying the status of viewer instances.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/admin/status/viewer-status-list/viewer-status-list-item.tpl',
	'registry'
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, {
				model: this.model,
				index: this.options.index + 1,
				project_url: Registry.application.getURL() + '#projects/' + data['projectid'],
				vm_hostname: data["vmhostname"],
				name: data["name"],
				state: data["state"],
				status: data["status"],
				vm_ip: data["vmip"],
				project_uuid: data["projectid"],
				viewer_instance_uuid: data["instance_uuid"],
				api_key: data["apikey"],
				url_uuid: data["url_uuid"],
				showNumbering: this.options.showNumbering
			});
		}
	});
});
