/******************************************************************************\
|                                                                              |
|                                   help-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the help/information view of the application.            |
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
	'text!templates/info/help.tpl',
	'config',
	'views/base-view'
], function($, _, Template, Config, BaseView) {
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
				contact: Config.contact,
				config: application.config
			};
		}
	});
});
