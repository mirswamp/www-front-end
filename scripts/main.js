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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
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

		// top level paths
		//
		vendor: '../vendor',
		library: '../library',
		templates: '../templates',
		styles: '../styles',
		svg: '../svg',

		// core library paths
		//
		text: '../library/require/text',
		jquery: '../library/jquery/jquery-3.4.1.min',
		underscore: '../library/underscore/underscore-min',
		backbone: '../library/backbone/backbone',
		'backbone.radio': '../library/backbone/radio/backbone.radio',
		marionette: '../library/backbone/marionette/backbone.marionette',
		clipboard: '../library/clipboard/clipboard.min',
		moment: '../library/moment/moment.min',

		// jquery plugin paths
		//
		'jquery.validate': '../vendor/jquery/validate/js/jquery.validate',
		'jquery.validate.bootstrap': '../vendor/jquery/validate/js/jquery.validate.bootstrap3',
		'jquery.cookie': '../vendor/jquery/cookie/jquery.cookie',
		'jquery.tablesorter': '../vendor/jquery/tablesorter/js/jquery.tablesorter',
		'jquery.tablesorterpager': '../vendor/jquery/tablesorter/js/jquery.tablesorter.pager',
		'jquery.datepicker': '../vendor/jquery/datepicker/js/datepicker',

		// jquery ui paths
		//
		'jquery-ui': '../vendor/jquery/jquery-ui/js/jquery-ui.min',

		// jquery ui plugin paths
		//
		'jquery-ui/core': '../vendor/jquery/jquery-ui/js/plugins/core',
		'jquery-ui/mouse': '../vendor/jquery/jquery-ui/js/plugins/mouse',
		'jquery-ui/widget': '../vendor/jquery/jquery-ui/js/plugins/widget',
		'jquery-ui/draggable': '../vendor/jquery/jquery-ui/js/plugins/draggable',
		'jquery-ui/droppable': '../vendor/jquery/jquery-ui/js/plugins/droppable',
		'jquery-ui/resizable': '../vendor/jquery/jquery-ui/js/plugins/resizable',
		'jquery-ui/sortable': '../vendor/jquery/jquery-ui/js/plugins/sortable',

		// bootstrap plugin paths
		//
		'bootstrap.clickover': '../vendor/bootstrap/js/plugins/bootstrap-clickover/bootstrapx-clickover',
		'bootstrap.combobox': '../vendor/bootstrap/js/plugins/bootstrap-combobox/bootstrap-combobox',
		'bootstrap.multimodal': '../vendor/bootstrap/js/plugins/multimodal/multimodal',
		'bootstrap.select': '../vendor/bootstrap/js/plugins/bootstrap-select/bootstrap-select',
		'bootstrap.timepicker': '../vendor/bootstrap/js/plugins/bootstrap-timepicker/bootstrap-timepicker',
		'bootstrap.typeahead': '../vendor/bootstrap/js/plugins/bootstrap3-typeahead/bootstrap3-typeahead',	
	
		// modernizr path
		//
		'modernizr': '../library/modernizr/modernizr.input-types',

		// vendor paths
		//
		ace: '../vendor/ace',
		bootstrap: '../vendor/bootstrap/js',
		select2: '../vendor/select2/js/select2',
		fancybox: '../vendor/fancybox/jquery.fancybox',
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
	application = new Application();

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
