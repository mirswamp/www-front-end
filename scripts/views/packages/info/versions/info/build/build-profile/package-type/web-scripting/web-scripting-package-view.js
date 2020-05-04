/******************************************************************************\
|                                                                              |
|                          web-scripting-package-view.js                       |
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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/collapse',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/web-scripting/web-scripting-package.tpl',
	'views/base-view',
	'widgets/accordions'
], function($, _, Collapse, Template, BaseView, Accordions) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model
			};
		},

		onRender: function() {
			
			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		}
	});
});
