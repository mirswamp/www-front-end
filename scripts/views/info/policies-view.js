/******************************************************************************\
|                                                                              |
|                                   policies-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the policy/information view of the application.          |
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
	'text!templates/info/policies.tpl',
	'registry',
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template)
	});
});
