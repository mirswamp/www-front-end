/******************************************************************************\
|                                                                              |
|                               not-found-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the about/information view of the application.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/not-found.tpl',
	'views/base-view'
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//
		
		template: _.template(Template)
	});
});
