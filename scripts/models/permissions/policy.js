define([
	'jquery',
	'underscore',
	'backbone',
	'config',
], function($, _, Backbone, Config) {
	return Backbone.Model.extend({

		//
		// Backbone attributes
		//

		idAttribute: 'policy_code',
		urlRoot: Config.servers.web + '/policies'
	});
});
