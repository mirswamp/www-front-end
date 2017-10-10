/******************************************************************************\
|                                                                              |
|                               run-queue-item-view.js                         |
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
	'text!templates/admin/status/run-queue/run-queue-item.tpl',
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
				url: Registry.application.getURL() + '#runs/' + data[0] + '/status',
				exec_run_uuid: data[0],
				cmd: data[1],
				submitted: data[2],
				run_time: data[3],
				status: data[4],
				pri: data[5],
				image: data[6],
				disk: data[7],
				host: data[8],
				vm: data[9],
				showNumbering: this.options.showNumbering
			});
		}
	});
});
