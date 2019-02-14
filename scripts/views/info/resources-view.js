/******************************************************************************\
|                                                                              |
|                                   resources-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines related resources for the application.                   |
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
	'text!templates/info/resources.tpl'
], function($, _, Backbone, Marionette, Template) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//
		
		template: _.template(Template)
	});
});
