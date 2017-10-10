/******************************************************************************\
|                                                                              |
|                                   main.js                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level tasks that need to be done (mostly         |
|        cofiguration related) and kicks off the application.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

//
// configure require.js
//

require.config({

	// timeout
	//
	waitSeconds: 0,

	// paths
	//
	baseUrl: 'scripts', 
	paths: {

		// config paths
		//
		config: 'config',

		// template paths
		//
		templates: '../templates',

		// library paths
		//
		text: 'library/require/text',
		jquery: 'library/jquery/jquery-1.9.1.min',
		'jquery-ui': 'library/jquery/jquery-ui/jquery-ui',
		underscore: 'library/underscore/underscore',
		backbone: 'library/backbone/backbone-e91b36c',
		'backbone.wreqr': 'library/backbone/wreqr/backbone.wreqr',
		'backbone.babysitter': 'library/backbone/babysitter/backbone.babysitter',
		marionette: 'library/backbone/marionette/backbone.marionette',
		clipboard: 'library/clipboard/clipboard.min',

		// jquery paths
		//
		'jquery.validate': 'library/jquery/validate/jquery.validate',
		'jquery.validate.bootstrap': 'library/jquery/validate/jquery.validate.bootstrap3',
		'jquery.cookie': 'library/jquery/cookie/jquery.cookie',
		'jquery.tablesorter': 'library/jquery/tablesorter/jquery.tablesorter',
		'jquery.datepicker': 'library/jquery/datepicker/datepicker',

		// jquery ui plugin paths
		//
		core: 'library/jquery/jquery-ui/plugins/core',
		mouse: 'library/jquery/jquery-ui/plugins/mouse',
		widget: 'library/jquery/jquery-ui/plugins/widget',
		draggable: 'library/jquery/jquery-ui/plugins/draggable',
		sortable: 'library/jquery/jquery-ui/plugins/sortable',

		// modernizr path
		//
		modernizr: 'library/modernizr/modernizr.input-types',
		
		// other plugins paths
		//
		select2: 'library/select2/select2.min',

		// vendor paths
		//
		bootstrap: '../vendor/bootstrap/js',
		fancybox: '../vendor/fancybox/jquery.fancybox',

		// bootstrap plugin paths
		//
		'bootstrap.clickover': '../vendor/bootstrap/js/plugins/bootstrap/clickover/bootstrapx-clickover',
		'bootstrap.combobox': '../vendor/bootstrap/js/plugins/bootstrap/combobox/bootstrap/combobox',
		'bootstrap.multimodal': '../vendor/bootstrap/js/plugins/multimodal/multimodal',
		'bootstrap.select': '../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select',
		'bootstrap.timepicker': '../vendor/bootstrap/js/plugins/bootstrap-timepicker/bootstrap-timepicker',
		'bootstrap.typeahead': '../vendor/bootstrap/js/plugins/bootstrap3-typeahead/bootstrap3-typeahead',
	},

	shim: {
		
		//
		// jquery dependencies
		//

		jquery: {
			exports: '$'
		},

		'jquery.validate': 	{
			deps: ['jquery'], 
			exports: '$.fn.validate'
		},

		'jquery.validate.bootstrap': {
			deps: ['jquery', 'jquery.validate'], 
			exports: '$.fn.validate.bootstrap'
		},

		'jquery.cookie': { 
			deps: ['jquery'], 
			exports: '$.cookie' 
		},

		'jquery.tablesorter': { 
			deps: ['jquery'], 
			exports: '$.tablesorter' 
		},

		'jquery.datepicker': { 
			deps: ['jquery'], 
			exports: '$.datepicker' 
		},

		'jquery.timepicker': { 
			deps: ['jquery'], 
			exports: '$.timepicker' 
		},

		'jquery.fancybox': { 
			deps: ['jquery'], 
			exports: '$.fancybox' 
		},

		select2: ['jquery', 'bootstrap.select'],
		
		modernizr: {
			exports: 'Modernizr'
		},

		//
		// backbone dependencies
		//

		underscore: {
			exports: '_'
		},

		backbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},

		marionette : {
			deps: ['jquery', 'underscore', 'backbone'],
			exports : 'Marionette'
		},

		//
		// bootstrap dependencies
		//

		'bootstrap/affix': { 
			deps: ['jquery'], 
			exports: '$.fn.affix' 
		}, 

		'bootstrap/alert': { 
			deps: ['jquery'], 
			exports: '$.fn.alert' 
		},

		'bootstrap/button': { 
			deps: ['jquery'], 
			exports: '$.fn.button' 
		},

		'bootstrap/carousel': { 
			deps: ['jquery'], 
			exports: '$.fn.carousel' 
		},

		'bootstrap/collapse': { 
			deps: ['jquery'], 
			exports: '$.fn.collapse'
		},

		'bootstrap/dropdown': { 
			deps: ['jquery'], 
			exports: '$.fn.dropdown' 
		},

		'bootstrap/modal': { 
			deps: ['jquery', 'bootstrap/transition'], 
			exports: '$.fn.modal' 
		},

		'bootstrap/popover': { 
			deps: ['jquery', 'bootstrap/tooltip'], 
			exports: '$.fn.popover'
		},

		'bootstrap/scrollspy': { 
			deps: ['jquery'], 
			exports: '$.fn.scrollspy'
		},

		'bootstrap/tab': { 
			deps: ['jquery'], 
			exports: '$.fn.tab'
		},

		'bootstrap/tooltip': { 
			deps: ['jquery'], 
			exports: '$.fn.tooltip'
		},

		'bootstrap/transition': {
			deps: ['jquery'],
			exports: '$.fn.transition'
		},

		//
		// bootstrap plugin dependencies
		//

		'bootstrap/clickover': ['bootstrap/popover'],
		'bootstrap/combobox': ['bootstrap/typeahead'],
		'bootstrap/multimodal': ['bootstrap/modal'],
	},

	/*
	bundles: {
		'bootstrap/bootstrap': [
			'bootstrap/affix',
			'bootstrap/alert',
			'bootstrap/button',
			'bootstrap/carousel',
			'bootstrap/collapse',
			'bootstrap/dropdown',
			'bootstrap/modal',
			'bootstrap/popover',
			'bootstrap/scrollspy',
			'bootstrap/tab',
			'bootstrap/tooltip',
			'bootstrap/transition'
		],
	}
	*/
});

//
// load application
//

require([
	'jquery',
	'application',
	'backbone'
], function($, Application, Backbone) {

	// required for IE
	//
	$.support.cors = true;

	// set global for future reference
	//
	var application = new Application();

	// wait for document ready
	//
	$(document).ready(function() {

		// store page load time
		//
		if (window.timing['document ready'] == undefined) {
			window.timing['document ready'] = new Date().getTime();
		}

		// store page load time
		//
		if (window.timing['url'] == undefined) {
			window.timing['url'] = window.top.location.href;
		}

		// go!
		//
		application.start();
	});
});