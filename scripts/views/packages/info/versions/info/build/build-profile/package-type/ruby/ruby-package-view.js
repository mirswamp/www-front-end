/******************************************************************************\
|                                                                              |
|                              ruby-package-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a non-editable view of a package versions's              |
|        language / type specific profile information.                         |
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
	'bootstrap/collapse',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/ruby/ruby-package.tpl',
	'widgets/accordions'
], function($, _, Backbone, Marionette, Collapse, Template, Accordions) {
	return Backbone.Marionette.ItemView.extend({

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		},

		onRender: function() {
			
			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		}
	});
});
