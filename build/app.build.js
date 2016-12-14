({
	appDir: "../",
	dir: "../../www-front-end-compressed",
	preserveLicenseComments: false,

	modules: [
		{
			name: "main",
			exclude: [
				"scripts/config/config.js"
			]
		}
	],
	
	baseUrl: 'scripts', 
	paths: {

		// config paths
		//
		config: 'config/config',

		// template paths
		//
		templates: '../templates',

		// library paths
		//
		jquery: 'library/jquery/jquery-1.9.1.min',
		'jquery-ui': 'library/jquery/jquery-ui/jquery-ui',
		underscore: 'library/underscore/underscore-min',
		backbone: 'library/backbone/backbone-e91b36c',
		'backbone.wreqr': 'library/backbone/wreqr/backbone.wreqr',
		'backbone.babysitter': 'library/backbone/babysitter/backbone.babysitter',
		marionette: 'library/backbone/marionette/backbone.marionette',
		text: 'library/require/text',
		fancybox: 'library/fancybox/jquery.fancybox',

		// jquery paths
		//
		jqueryvalidate: 'library/jquery/validate/jquery.validate',
		validate: 'library/jquery/validate/jquery.validate.bootstrap3',
		cookie: 'library/jquery/cookie/jquery.cookie',
		tablesorter: 'library/jquery/tablesorter/jquery.tablesorter',
		datepicker: 'library/jquery/datepicker/datepicker',

		// bootstrap paths
		//
		affix: 'library/bootstrap/affix',
		alert: 'library/bootstrap/alert',
		button: 'library/bootstrap/button',
		carousel: 'library/bootstrap/carousel',
		collapse: 'library/bootstrap/collapse',
		dropdown: 'library/bootstrap/dropdown',
		modal: 'library/bootstrap/modal',
		popover: 'library/bootstrap/popover',
		scrollspy: 'library/bootstrap/scrollspy',
		tab: 'library/bootstrap/tab',
		tooltip: 'library/bootstrap/tooltip',
		transition: 'library/bootstrap/transition',

		// bootstrap plugin paths
		//
		clickover: 'library/bootstrap/plugins/bootstrap-clickover/bootstrapx-clickover',
		select: 'library/bootstrap/plugins/bootstrap-select/bootstrap-select',
		combobox: 'library/bootstrap/plugins/bootstrap-combobox/bootstrap-combobox',
		timepicker: 'library/bootstrap/plugins/bootstrap-timepicker/bootstrap-timepicker',
		typeahead: 'library/bootstrap/plugins/bootstrap3-typeahead/bootstrap3-typeahead',

		// modernizr path
		//
		modernizr: 'library/modernizr/modernizr.input-types',
		
		// other plugins paths
		//
		select2: 'library/select2/select2.min'
	},

	shim: {

		underscore: {
			exports: '_'
		},

		//
		// jquery dependencies
		//

		jquery: {
			exports: '$'
		},

		jqueryvalidate: {
			deps: ['jquery']
		},

		validate: {
			deps: ['jqueryvalidate']
		},

		cookie: {
			deps: ['jquery']
		},

		tablesorter: {
			deps: ['jquery']
		},

		datepicker: {
			deps: ['jquery']
		},

		timepicker: {
			deps: ['jquery']
		},

		fancybox: {
			deps: ['jquery']
		},

		//
		// bootstrap dependencies
		//

		modal: {
			deps: ['transition', 'jquery']
		},

		transition: {
			deps: ['jquery']
		},

		popover: {
			deps: ['tooltip']
		},

		clickover: {
			deps: ['popover']
		},

		combobox: {
			deps: ['typeahead']
		},

		collapse: {
			deps: ['jquery', 'transition']
		},

		select2: {
			deps: ['select', 'combobox']
		},

		//
		// backbone dependencies
		//

		backbone: {
			deps: ['underscore', 'jquery', 'modal'],
			exports: 'Backbone'
		},

		marionette : {
			deps : ['jquery', 'underscore', 'backbone'],
			exports : 'Marionette'
		},

		modernizr: {
			exports: 'Modernizr'
		},

		//
		// utility dependencies
		//

		'utilities/time/time-utils': {
			deps: ['utilities/time/iso8601']
		},
		
		'utilities/time/date-utils': {
			deps: ['utilities/time/time-utils', 'utilities/time/date-format']
		}
	},
})
