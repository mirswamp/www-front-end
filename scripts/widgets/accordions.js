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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'bootstrap/collapse',
], function($, Collapse) {
	return function(el) {

		// make sure that popovers don't get clipped by acordions
		//
		/*
		$(el).find('.panel-collapse').on('shown', function(event) {
			$(event.target).css('overflow', 'visible');
		});
		$(el).find('.panel-collapse').on('hide', function(event) {
			$(event.target).css('overflow', 'hidden');
		});
		*/

		// change accordion icon
		//
		$(el).find('.collapse').on('show.bs.collapse', function(event) {
			$(event.target).parent().find('.panel-heading a i').removeClass('fa-plus-circle');
			$(event.target).parent().find('.panel-heading a i').addClass('fa-minus-circle');
		});
		$(el).find('.collapse').on('hide.bs.collapse', function(event) {
			$(event.target).parent().find('.panel-heading a i').removeClass('fa-minus-circle');
			$(event.target).parent().find('.panel-heading a i').addClass('fa-plus-circle');
		});
	}
});