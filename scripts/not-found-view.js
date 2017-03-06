/******************************************************************************\
|                                                                              |
|                                   404-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the about/information view of the application.           |
|                                                                              |
|******************************************************************************|
|              Copyright (c) 2015 - Morgridge Institute for Research           |
\******************************************************************************/


define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/404.tpl'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.View.extend({

		//
		// attributes
		//
		
		template: _.template(Template)
	});
});
