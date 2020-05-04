/******************************************************************************\
|                                                                              |
|                         dot-net-package-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a package versions's                 |
|        language / type specific profile info.                                |
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
	'text!templates/packages/info/versions/info/build/build-profile/package-type/dot-net/dot-net-package-form.tpl',
	'widgets/accordions',
	'views/packages/info/versions/info/build/build-profile/package-type/package-type-form-view',
	'utilities/scripting/file-utils',
	'utilities/web/html-utils'
], function($, _, Template, Accordions, PackageTypeFormView) {
	return PackageTypeFormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'change .solution select': 'onChangeSolution',
			'change .project .checkbox-inline input': 'onChangeProjectSelected'
		},

		//
		// querying methods
		//

		getBuildSystemName: function(buildSystem) {
			return '.NET';
		},

		getBuildSystem: function() {
			return '.net';
		},

		getSelectedIndex: function() {
			var solution = this.$el.find('.solution select option:selected');
			return parseInt(solution.attr('index'));
		},

		getSelectedSolution: function() {
			var solutions = this.model.get('package_info').sln_files;
			if (solutions) {
				var keys = Object.keys(solutions);
				var index = this.getSelectedIndex();
				var key = keys[index];
				var filename = getRelativePathBetween(this.model.get('source_path'), key);
				var solution = {};
				solution[filename] = solutions[key];
				return solution;
			}
		},

		getSelectedProjects: function() {
			var selected = {};
			var solutions = this.model.get('package_info').sln_files;
			var projects = this.model.get('package_info').proj_files;
			var $projects = this.$el.find('.project');
			var keys = Object.keys(projects).sort();

			for (var i = 0; i < $projects.length; i++) {
				var key = keys[i];
				var project = projects[key];
				var $project = $($projects[i]);

				// if no solutions, then make projects relative to package path
				//
				if (!solutions) {
					key = getRelativePathBetween(this.model.get('source_path'), key);
				}

				// check if project belongs to solution
				//
				if ($project.is(':visible')) {

					// find selected framework and configuration
					//
					var frameworkIndex = parseInt($project.find('.framework input[type="radio"]:checked').val());
					var configurationIndex = parseInt($project.find('.configuration input[type="radio"]:checked').val());
			
					if (isNaN(frameworkIndex)) {
						frameworkIndex = 0;
					}
					if (isNaN(configurationIndex)) {
						configurationIndex = 0;
					}

					var framework = project.frameworks? project.frameworks[frameworkIndex] : null;
					var configuration = project.configurations? project.configurations[configurationIndex] : null;

					// set selected project attributes
					//
					selected[key] = {};
					if (framework) {
						selected[key].framework = framework;
					}
					if (configuration) {
						selected[key].configuration = configuration;
					}
					if (!$project.find('.name input').is(':checked')) {
						selected[key].nobuild = true;
					}
				}
			}

			return selected;
		},

		//
		// form querying methods
		//

		isValid: function() {
			return true;
		},

		getValues: function() {
			return {
				'package_build_settings': {
					'sln_files': this.getSelectedSolution(),
					'proj_files': this.getSelectedProjects()
				}
			};
		},

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

			// call superclass method
			//
			PackageTypeFormView.prototype.onRender.call(this);
		},

		//
		// event handling methods
		//

		onChangeSolution: function() {
			
			// show / hide solution details
			//
			var index = this.getSelectedIndex();
			var options = this.$el.find('select option');

			// show projects belonging to this solution
			//
			this.$el.find('.project').hide();
			this.$el.find('.solution' + index).show();
		},

		onChangeProjectSelected: function(event) {
			var $checkbox = $(event.target);

			// get checkbox value
			//
			var selected = $checkbox.is(':checked');
			if (selected) {
				$checkbox.closest('.project').find('.radio-inline input').removeAttr('disabled');
			} else {
				$checkbox.closest('.project').find('.radio-inline input').attr('disabled', true);	
			}
		}
	});
});
