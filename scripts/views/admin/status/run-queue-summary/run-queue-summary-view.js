/******************************************************************************\
|                                                                              |
|                           run-queue-summary-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for summarizing the status of the run queue.           |
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
	'text!templates/admin/status/run-queue-summary/run-queue-summary.tpl',
	'views/base-view'
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		tagName: 'table',
		template: _.template(Template)
	});
});
