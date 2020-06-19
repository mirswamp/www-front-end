/******************************************************************************\
|                                                                              |
|                                 accordion-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing an expanding accordion.             |
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
	'bootstrap/collapse',
], function($, Collapse) {
	return function(el) {

		// change accordion icon
		//
		$(el).find('.collapse').on('show.bs.collapse', function(event) {
			$(event.target).parent().find('a[data-toggle="collapse"] i').removeClass('fa-plus-circle');
			$(event.target).parent().find('a[data-toggle="collapse"] i').addClass('fa-minus-circle');
		});
		$(el).find('.collapse').on('hide.bs.collapse', function(event) {
			$(event.target).parent().find('a[data-toggle="collapse"] i').removeClass('fa-minus-circle');
			$(event.target).parent().find('a[data-toggle="collapse"] i').addClass('fa-plus-circle');
		});
	};
});