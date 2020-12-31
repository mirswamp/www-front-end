/******************************************************************************\
|                                                                              |
|                          package-type-form-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entereing a package versions's                |
|        language / type specific profile info.                                |
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
	'bootstrap/dropdown',
	'bootstrap.select',
	'views/forms/form-view'
], function($, _, Collapse, Dropdown, Select, FormView) {
	return FormView.extend({

		//
		// attributes
		//

		notices: {

			// messages used for C and Java package types
			//
			'no-build': "This package does not appear to include a build file. You can set the build system and advanced settings if this is not correct. By selecting the no build option, analysis is limited to compilable files located directly in the build path. If the build path is not set the package path is used. You may set the build path to include the files that you would like to be assessed.",
			'select-no-build': "By selecting the no build option, analysis is limited to compilable files located directly in the build path. If the build path is not set the package path is used. You may set the build path to include the files that you would like to be assessed.",
			
			// messages used for ruby, python, and web scripting package types
			//
			'none': "This package does not appear to include a build file. You can set the build system and advanced settings if this is not correct. By selecting a build system of 'none', source files in the package path and its sub directories will be assessed. Click Show Source Files for a list of those files.",
			'select-none': "By selecting a build system of 'none', source files in the package path and its sub directories will be assessed. Click Show Source Files for a list of those files.",
		},

		//
		// form attributes
		//

		rules: {
			'build-system': {
				buildSystemRequired: true
			}
		},

		messages: {
			'build-target': "Please specify a build target."
		},

		//
		// constructor
		//

		initialize: function() {

			//
			// tweak validator to work with form groups
			//

			$.validator.setDefaults({
				highlight: function(element) {
					$(element).closest('.form-group').addClass('error');
				},
				unhighlight: function(element) {
					$(element).closest('.form-group').removeClass('error');
				},
				errorPlacement: function(error, element) {
					if(element.parent('.input-group').length) {
						error.insertAfter(element.parent());
					} else {
						error.insertAfter(element);
					}
				}
			});

			// add custom validation rules
			//
			jQuery.validator.addMethod('buildSystemRequired', function (value) {
				return (value != undefined);
			}, "Please specify a build system.");
		}
	});
});
