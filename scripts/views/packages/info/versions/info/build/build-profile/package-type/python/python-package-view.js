/******************************************************************************\
|                                                                              |
|                             python-package-view.js                           |
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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/collapse',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/python/python-package.tpl',
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
				isWheel: this.model.getFilename().endsWith('.whl')
			};
		},

		onRender: function() {
			
			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));
		}
	});
});
