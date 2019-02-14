/******************************************************************************\
|                                                                              |
|                                   404-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the about/information view of the application.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
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
