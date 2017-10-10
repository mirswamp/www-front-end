/******************************************************************************\
|                                                                              |
|                            run-status-list-item-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a job in the run queue.            |
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
	'text!templates/admin/status/run-status-list/run-status-list-item.tpl',
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
				url: Registry.application.getURL() + '#runs/' + data['execrunuid'] + '/status',
				project_url: Registry.application.getURL() + '#projects/' + data['projectid'],
				exec_run_uuid: data['execrunuid'],
				vm_hostname: data['vmhostname'],
				project_uuid: data['projectid'],
				status: data['status'],
				showNumbering: this.options.showNumbering
			});
		}
	});
});
