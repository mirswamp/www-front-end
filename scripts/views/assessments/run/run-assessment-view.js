/******************************************************************************\
|                                                                              |
|                               run-assessment-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for creating and runnin a new assesment.        |
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
	'text!templates/assessments/run/run-assessment.tpl',
	'models/assessments/assessment-run',
	'models/run-requests/run-request',
	'views/base-view',
	'views/projects/selectors/project-selector-view',
	'views/packages/selectors/package-selector-view',
	'views/tools/selectors/tool-selector-view',
	'views/platforms/selectors/platform-selector-view',
	'views/assessments/dialogs/confirm-run-request-dialog-view'
], function($, _, Template, AssessmentRun, RunRequest, BaseView, ProjectSelectorView, PackageSelectorView, ToolSelectorView, PlatformSelectorView, ConfirmRunRequestDialogView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			project: '#project-selector',
			package: '#package-selector',
			package_version: '#package-version-selector',
			tool: '#tool-selector',
			tool_version: '#tool-version-selector',
			platform: '#platform-selector',
			platform_version: '#platform-version-selector'
		},

		events: {
			'click #include-public input': 'onClickIncludePublic',
			'click #save': 'onClickSave',
			'click #save-and-run': 'onClickSaveAndRun',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function() {
			var self = this;

			// create new assessment run
			//
			this.model = new AssessmentRun({
				'project_uuid': (self.options.data.project || this.options.project).get('project_uid')
			});

			// check for platform independent packages
			//
			if (this.options.data.package && !this.options.data.package.isPlatformUserSelectable()) {
				this.options.data.platform = undefined;
				this.options.data['platform-version'] = undefined;
			}
		},

		//
		// button enabling / disabling methods
		//

		enableButtons: function() {
			this.$el.find('#save').removeAttr('disabled');
			this.$el.find('#save-and-run').removeAttr('disabled');
		},

		disableButtons: function() {
			this.$el.find('#save').attr('disabled','disabled');
			this.$el.find('#save-and-run').attr('disabled','disabled');
		},

		getValues: function() {

			// get triplet information
			//
			var selectedProject = this.getProject();
			var selectedPackage = this.getPackage();
			var selectedPackageVersion = this.getPackageVersion();
			var selectedTool = this.getTool();
			var selectedToolVersion = this.getToolVersion();
			var selectedPlatform = this.getPlatform();
			var selectedPlatformVersion = this.getPlatformVersion();

			// set package and tool
			//
			var values = {
				'assessment_run_uuid': undefined,
				'project_uuid': selectedProject.get('project_uid'),

				'package_uuid': selectedPackage.get('package_uuid'),
				'package_version_uuid': selectedPackageVersion? selectedPackageVersion.get('package_version_uuid') : null,

				'tool_uuid': selectedTool? selectedTool.get('tool_uuid') : '*',
				'tool_version_uuid': selectedToolVersion? selectedToolVersion.get('tool_version_uuid') : null,
			};

			// set platform, if one is defined
			//
			if (selectedPlatform) {
				values = _.extend(values, {
					'platform_uuid': selectedPlatform.get('platform_uuid'),
					'platform_version_uuid': selectedPlatformVersion? selectedPlatformVersion.get('platform_version_uuid') : null					
				});
			}

			return values;
		},

		saveIncompatible: function(assessmentRun) {
			var self = this;

			// save assessment
			//
			assessmentRun.save(undefined, {

				// callbacks
				//
				success: function(jqxhr, textstatus, errorThrown) {
					var queryString = self.getPackageQueryString();

					// go to my assessments view
					//
					application.navigate('#assessments' + (queryString != ''? '?' + queryString : ''));
				},

				error: function(jqxhr, textstatus, errorThrown) {

					// show error message
					//
					application.error({
						message: "Could not save this assessment."
					});
				}
			});
		},

		saveWithPermission: function(assessmentRun, options) {
			var self = this;

			// get triplet information
			//
			var selectedPackage = this.getPackage();
			var selectedPackageVersion = this.getPackageVersion();
			var selectedTool = this.getTool();
			var selectedToolVersion = this.getToolVersion();
			var selectedPlatform = this.getPlatform();
			var selectedPlatformVersion = this.getPlatformVersion();

			// ensure the user has permission and has accepted any pertinent EULAs
			//
			selectedTool.checkPermission({
				project_uid: assessmentRun.get('project_uuid'),
				package_uuid: assessmentRun.get('package_uuid'),

				// callbacks
				//
				approved: function() {

					// disable save buttons
					//
					self.disableButtons();

					// save assessment
					//
					assessmentRun.save(undefined, options);
				},

				denied: function (response) {
					switch (response.status) {

						case 'no_permission':
							selectedTool.noToolPermission();
							break;

						case 'owner_no_permission':

							// show notification
							//
							application.notify({
								message: "The owner of this project must request permission to use \"" + selectedTool.get('name') + ".\""
							});
							break;

						case 'no_user_policy':
							selectedTool.confirmToolPolicy({
								policy_code: response.policy_code,
								policy: response.policy,

								// callbacks
								//
								error: function(response) {

									// show error message
									//
									application.error({
										message: "Error saving policy acknowledgement."
									});
								}
							});
							break;

						case 'project_unbound':
							selectedTool.confirmToolProject({
								trial_project: self.options.data.project.isTrialProject(),
								project_uid: self.options.data.project.get('project_uid'),
								user_permission_uid: response.user_permission_uid,

								// callbacks
								//
								error: function (response) {

									// show error message
									//
									application.error({
										message: "Could not designate this project."
									});
								}
							});
							break;

						case 'member_project_unbound':

							// show notification
							//
							application.notify({
								message: "The project owner has not designated \"" + self.options.data.project.get('full_name') + "\" for use with \"" + selectedTool.get('name') + ".\" To do so the project owner must add an assessment which uses \"" + selectedTool.get('name') + ".\""
							});
							break;

						case 'package_unbound':
							selectedTool.confirmToolPackage(selectedPackage);
							break;

						default:

							// show error message
							//
							application.error({
								message: response.responseText
							});
							break;
					}
				}
			});	
		},

		save: function(assessmentRun, options) {
			var self = this;

			// get triplet information
			//
			var selectedPackage = self.getPackage();
			var selectedPackageVersion = self.getPackageVersion();
			var selectedTool = self.getTool();
			var selectedToolVersion = self.getToolVersion();
			var selectedPlatform = self.getPlatform();
			var selectedPlatformVersion = self.getPlatformVersion();

			// update model
			//
			this.model.set(this.getValues());
			
			// check compatibility and save assessment
			//
			assessmentRun.checkCompatibility({
				data: assessmentRun.attributes,

				// callbacks
				//
				success: function() {
					if (selectedTool) {
						self.saveWithPermission(assessmentRun, options);
					} else {

						// disable save buttons
						//
						self.disableButtons();

						// save assessment
						//
						assessmentRun.save(undefined, options);
					}
				},

				error: function(jqxhr, textstatus, errorThrown) {
					if (jqxhr.responseText === 'incompatible' || true) {

						// ask for confirmation to save anyway
						//
						var packageName = selectedPackage.get('name');
						var packageVersion = selectedPackageVersion ? selectedPackageVersion.get('version_string') : 'latest';
						var message = "Package " + packageName + " version " + packageVersion + " is not compatible";

						if (selectedPlatform) {
							var platformName = selectedPlatform.get('name');
							var platformVersion = selectedPlatformVersion ? selectedPlatformVersion.get('version_string') : 'latest';
							message += " with platform " + platformName + " version " + platformVersion;
						}
						message += ". Save assessment anyway?";

						// show confirmation
						//
						application.confirm({
							title: "Save Incompatible Assessment",
							message: message,

							// callbacks
							//
							accept: function() {
								self.saveIncompatible(assessmentRun);
							},
						});
					} else {

						// show error message
						//
						application.error({
							message: "Could not save this assessment."
						});
					}
				}
			});
		},

		scheduleOneTimeRunRequest: function(assessmentRun, notifyWhenComplete) {
			var self = this;
			var runRequest = new RunRequest();
			var assessmentRunUuid = assessmentRun.get('assessment_run_uuid');
			var assessmentRunUuids;

			// find assessment run uuids based on parameter type
			//
			if (typeof assessmentRunUuid == 'string') {
				assessmentRunUuids = [assessmentRunUuid];
			} else {
				assessmentRunUuids = assessmentRunUuid;
			}

			// save run request
			//
			runRequest.saveOneTimeRunRequests(assessmentRunUuids, notifyWhenComplete, {

				// callbacks
				//
				success: function() {
					var queryString = self.getPackageQueryString();

					// go to runs / results view
					//
					application.navigate('#results' + (queryString != ''? '?' + queryString : ''));
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save run request assoc."
					});
				}
			});
		},

		run: function(assessmentRun) {
			var self = this;
			
			// show confirm dialog box
			//
			application.show(new ConfirmRunRequestDialogView({
				selectedAssessmentRuns: [assessmentRun],

				// callbacks
				//
				accept: function(selectedAssessmentRuns, notifyWhenComplete) {
					self.scheduleOneTimeRunRequest(assessmentRun, notifyWhenComplete);
				},

				reject: function() {
					self.enableButtons();
				}
			}));
		},

		//
		// triplet querying methods
		//

		getProject: function() {
			if (this.hasChildView('project')) {

				// return selected project
				//
				return this.getChildView('project').getSelected();
			} else if (this.options.data.project) {

				// return initial project
				//
				return this.options.data.project;
			} else {

				// return default project
				//
				return this.options.project;
			}
		},

		getPackage: function() {
			if (this.hasChildView('package')) {

				// return selected package
				//
				return this.getChildView('package').getSelected();
			}
		},

		getPackageVersion: function() {
			if (this.hasChildView('package_version')) {

				// return selected package version
				//
				return this.getChildView('package_version').getSelected();
			}
		},

		getTool: function() {
			if (this.hasChildView('tool')) {

				// return selected tool
				//
				return this.getChildView('tool').getSelected();
			}
		},

		getToolVersion: function() {
			if (this.hasChildView('tool_version')) {

				// return selected tool version
				//
				return this.getChildView('tool_version').getSelected();
			}
		},

		getPlatform: function() {
			if (this.hasChildView('platform')) {

				// return selected platform
				//
				return this.getChildView('platform').getSelected();
			}
		},

		getPlatformVersion: function() {
			if (this.hasChildView('platform_version')) {

				// return selected platform version
				//
				return this.getChildView('platform_version').getSelected();
			}
		},

		//
		// querying methods
		//

		getProjectQueryString: function() {
			var project = this.getProject();
			if (!project.isTrialProject()) {
				return 'project=' + project.get('project_uid');
			} else {
				return 'project=default';
			}		
		},

		getQueryString: function() {
			var queryString = this.getProjectQueryString();

			if (this.options.data['package-version']) {
				queryString = addQueryString(queryString, 'package-version=' + (this.options.data['package-version'] != 'latest'? this.options.data['package-version'].get('package_version_uuid') : 'latest'));
			} else if (this.options.data.package) {
				queryString = addQueryString(queryString, 'package=' + this.options.data.package.get('package_uuid'));
			}
			if (this.options.data['tool-version']) {
				queryString = addQueryString(queryString, 'tool-version=' + (this.options.data['tool-version'] != 'latest'? this.options.data['tool-version'].get('tool_version_uuid') : 'latest'));
			} else if (this.options.data.tool) {
				queryString = addQueryString(queryString, 'tool=' + this.options.data.tool.get('tool_uuid'));
			}
			if (this.options.data['platform-version']) {
				queryString = addQueryString(queryString, 'platform-version=' + (this.options.data['platform-version'] != 'latest'? this.options.data['platform-version'].get('platform_version_uuid') : 'latest'));
			} else if (this.options.data.platform) {
				queryString = addQueryString(queryString, 'platform=' + this.options.data.platform.get('platform_uuid'));
			}

			return queryString;
		},

		getAssessmentQueryString: function() {
			var queryString = this.getProjectQueryString();

			// get selected items
			//
			var selectedPackage = this.getPackage();
			var selectedPackageVersion = this.getPackageVersion();
			var selectedTool = this.getTool();
			var selectedToolVersion = this.getToolVersion();
			var selectedPlatform = this.getPlatform();
			var selectedPlatformVersion = this.getPlatformVersion();

			if (selectedPackageVersion) {
				queryString = addQueryString(queryString, 'package-version=' + (selectedPackageVersion.get('package_version_uuid')? selectedPackageVersion.get('package_version_uuid') : 'latest'));
			} else if (selectedPackage) {
				queryString = addQueryString(queryString, 'package=' + selectedPackage.get('package_uuid'));
			}
			if (selectedToolVersion) {
				queryString = addQueryString(queryString, 'tool-version=' + (selectedToolVersion.get('tool_version_uuid')? selectedToolVersion.get('tool_version_uuid') : 'latest'));
			} else if (selectedTool) {
				queryString = addQueryString(queryString, 'tool=' + selectedTool.get('tool_uuid'));
			}
			if (selectedPlatformVersion) {
				queryString = addQueryString(queryString, 'platform-version=' + (selectedPlatformVersion.get('platform_version_uuid')? selectedPlatformVersion.get('platform_version_uuid') : 'latest'));
			} else if (selectedPlatform) {
				queryString = addQueryString(queryString, 'platform=' + selectedPlatform.get('platform_uuid'));
			}

			return queryString;
		},

		getPackageQueryString: function() {
			var queryString = this.getProjectQueryString();

			// get selected items
			//
			var selectedPackage = this.getPackage();
			var selectedPackageVersion = this.getPackageVersion();

			if (selectedPackageVersion) {
				queryString = addQueryString(queryString, 'package-version=' + (selectedPackageVersion.get('package_version_uuid')? selectedPackageVersion.get('package_version_uuid') : 'latest'));
			} else if (selectedPackage) {
				queryString = addQueryString(queryString, 'package=' + selectedPackage.get('package_uuid'));
			}

			return queryString;
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				hasProjects: application.session.user.hasProjects(),
				project: this.options.data.project,
				package: this.options.data.package,
				packageVersion: this.options.data['package-version'],
				tool: this.options.data.tool,
				toolVersion: this.options.data['tool-version'],
				platform: this.options.data.platform,
				platformVersion: this.options.data['platform-version'],
				includePublic: this.options.data.package? !this.options.data.package.get('is_owned') : false
			};
		},

		onRender: function() {

			// show child views
			//
			this.showSelectors();
		},

		getProjectSelector: function() {
			var self = this;
			return new ProjectSelectorView({
				collection: self.options.projects,
				initialValue: this.options.data.project || this.options.project,

				// callbacks
				//
				onChange: function(changes) {
					if (changes.project) {
						self.$el.find('#package-selection').show();
					}
					self.packageSelectorView.setProject(changes.project, {
						package: self.getPackage(),
						packageVersion: self.getPackageVersion()
					});
				}
			});
		},

		getPackageSelector: function(showPublicPackages) {
			var self = this;
			return new PackageSelectorView({
				project: this.getProject(),
				initialValue: this.options.data.package,
				initialVersion: this.options.data['package-version'] != 'latest'? this.options.data['package-version'] : undefined,
				versionSelectorRegion: this.getRegion('package_version'),
				showPlatformDependent: (this.options.data.platform != undefined || 
					this.options.data.platform != undefined),
				showPublicPackages: showPublicPackages,

				// callbacks
				//
				onChange: function(changes) {
					if (changes.package) {
						self.$el.find('#tool-selection').show();
					}
					self.toolSelectorView.setPackage(changes.package);
					self.platformSelectorView.setPackage(changes.package);
				}
			});
		},

		getToolSelector: function() {
			var self = this;
			return new ToolSelectorView({
				project: this.getProject(),
				initialValue: this.options.data.tool,
				initialVersion: this.options.data['tool-version'] != 'latest'? this.options.data['tool-version'] : undefined,
				packageSelected: this.options.data.package,
				platformSelected: this.options.data.platform,
				versionSelectorRegion: this.getRegion('tool_version'),
				addAssessmentView: this,

				// callbacks
				//
				onChange: function(changes) {
					self.platformSelectorView.setTool(changes.tool);
				}
			});
		},

		getPlatformSelector: function() {
			var self = this;
			return new PlatformSelectorView({
				project: this.getProject(),
				initialValue: this.options.data.platform,
				initialVersion: this.options.data['platform-version'] != 'latest'? this.options.data['platform-version'] : undefined,
				packageSelected: this.options.data.package,
				toolSelected: this.options.data.tool,
				versionSelectorRegion: this.getRegion('platform_version'),

				// callbacks
				//
				onChange: function(changes) {
					self.onChange();
				}
			});
		},

		showSelectors: function() {
			var showPublicPackages = this.$el.find('#include-public input').is(':checked');

			// create selectors
			//
			if (application.session.user.hasProjects()) {
				this.projectSelectorView = this.getProjectSelector();
			}
			this.packageSelectorView = this.getPackageSelector(showPublicPackages);
			this.toolSelectorView = this.getToolSelector();
			this.platformSelectorView = this.getPlatformSelector();

			// show selectors
			//
			if (application.session.user.hasProjects()) {
				this.showChildView('project', this.projectSelectorView);
			}
			this.showChildView('package', this.packageSelectorView);
			this.showChildView('tool', this.toolSelectorView);
			this.showChildView('platform', this.platformSelectorView);
		},

		//
		// event handling methods
		//

		onClickIncludePublic: function() {
			var showPublicPackages = this.$el.find('#include-public input').is(':checked');

			// show selectors
			//
			this.packageSelectorView.destroy();
			this.packageSelectorView = this.getPackageSelector(showPublicPackages);
			this.showChildView('package', this.packageSelectorView);
		},

		onChange: function() {
			var selectedProject = this.getProject();
			var selectedPackage = this.getPackage();
			var selectedTool = this.getTool();
			var selectedPlatform = this.getPlatform();

			// enable or disable buttons
			//
			if (selectedPackage && selectedPlatform ||
				selectedPackage && !selectedPackage.isPlatformUserSelectable()) {
				this.enableButtons();
			} else {
				this.disableButtons();
			}

			// show / hide package selector
			//
			if (selectedProject) {
				this.$el.find('#package-selection').show();
			} else if (selectedTool) {
				this.$el.find('#package-selection').hide();
			}

			// show / hide tool selector
			//
			if (selectedPackage) {
				this.$el.find('#tool-selection').show();
			} else if (selectedTool) {
				this.$el.find('#tool-selection').hide();
			}

			// show / hide platform selector
			//
			if (selectedPackage && selectedPackage.isPlatformUserSelectable()) {
				this.$el.find('#platform-selection').show();
			} else {
				this.$el.find('#platform-selection').hide();
			}
		},

		onClickSave: function() {
			var self = this;

			// save assessment
			//
			this.save(this.model, {

				// callbacks
				//
				success: function() {
					var queryString = self.getPackageQueryString();

					// go to my assessments view
					//
					application.navigate('#assessments' + (queryString != ''? '?' + queryString : ''));
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save this assessment."
					});
				}
			});
		},

		onClickSaveAndRun: function() {
			var self = this;

			// save assessment
			//
			this.save(this.model, {

				// callbacks
				//
				success: function() {
					self.run(self.model);
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not save this assessment."
					});
				}
			});
		},

		onClickCancel: function() {
			history.back();
		}
	});
});
