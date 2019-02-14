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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/assessments/run/run-assessment.tpl',
	'registry',
	'models/assessments/assessment-run',
	'models/run-requests/run-request',
	'views/projects/selectors/project-selector-view',
	'views/packages/selectors/package-selector-view',
	'views/tools/selectors/tool-selector-view',
	'views/platforms/selectors/platform-selector-view',
	'views/dialogs/confirm-view',
	'views/dialogs/error-view',
	'views/dialogs/notify-view',
	'views/assessments/dialogs/confirm-run-request-view'
], function($, _, Backbone, Marionette, Template, Registry, AssessmentRun, RunRequest, ProjectSelectorView, PackageSelectorView, ToolSelectorView, PlatformSelectorView, ConfirmView, ErrorView, NotifyView, ConfirmRunRequestView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			projectSelector: '#project-selector',
			packageSelector: '#package-selector',
			packageVersionSelector: '#package-version-selector',
			toolSelector: '#tool-selector',
			toolVersionSelector: '#tool-version-selector',
			platformSelector: '#platform-selector',
			platformVersionSelector: '#platform-version-selector'
		},

		events: {
			'click #save': 'onClickSave',
			'click #save-and-run': 'onClickSaveAndRun',
			'click #cancel': 'onClickCancel'
		},

		//
		// methods
		//

		initialize: function() {
			var self = this;

			// create new assessment run
			//
			this.model = new AssessmentRun({
				'project_uuid': (self.options.data['project'] || this.options.project).get('project_uid')
			});

			// check for platform independent packages
			//
			if (this.options.data['package'] && !this.options.data['package'].isPlatformUserSelectable()) {
				this.options.data['platform'] = undefined;
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

		update: function(assessmentRun) {

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
			assessmentRun.set({
				'assessment_run_uuid': undefined,
				'project_uuid': selectedProject.get('project_uid'),

				'package_uuid': selectedPackage.get('package_uuid'),
				'package_version_uuid': selectedPackageVersion? selectedPackageVersion.get('package_version_uuid') : null,

				'tool_uuid': selectedTool? selectedTool.get('tool_uuid') : '*',
				'tool_version_uuid': selectedToolVersion? selectedToolVersion.get('tool_version_uuid') : null,
			});

			// set platform, if one is defined
			//
			if (selectedPlatform) {
				assessmentRun.set({
					'platform_uuid': selectedPlatform.get('platform_uuid'),
					'platform_version_uuid': selectedPlatformVersion? selectedPlatformVersion.get('platform_version_uuid') : null,
				});
			}
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
					Backbone.history.navigate('#assessments' + (queryString != ''? '?' + queryString : ''), {
						trigger: true
					});
				},

				error: function(jqxhr, textstatus, errorThrown) {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save this assessment."
						})
					);
				}
			});
		},

		saveWithPermission: function(assessmentRun, selectedTool, options) {
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
							Registry.application.modal.show(
								new NotifyView({
									message: "The owner of this project must request permission to use \"" + selectedTool.get('name') + ".\""
								})
							);
							break;

						case 'no_user_policy':
							selectedTool.confirmToolPolicy({
								policy_code: response.policy_code,
								policy: response.policy,

								// callbacks
								//
								error: function(response) {

									// show error dialog
									//
									Registry.application.modal.show(
										new ErrorView({
											message: "Error saving policy acknowledgement."
										})
									);
								}
							});
							break;

						case 'project_unbound':
							selectedTool.confirmToolProject({
								trial_project: self.options.data['project'].isTrialProject(),
								project_uid: self.options.data['project'].get('project_uid'),
								user_permission_uid: response.user_permission_uid,

								// callbacks
								//
								error: function (response) {

									// show error dialog
									//
									Registry.application.modal.show(
										new ErrorView({
											message: "Could not designate this project."
										})
									);
								}
							});
							break;

						case 'member_project_unbound':
							Registry.application.modal.show(
								new NotifyView({
									message: "The project owner has not designated \"" + self.options.data['project'].get('full_name') + "\" for use with \"" + selectedTool.get('name') + ".\" To do so the project owner must add an assessment which uses \"" + selectedTool.get('name') + ".\""
								})
							);
						case 'package_unbound':
							selectedTool.confirmToolPackage(selectedPackage);
							break;

						default:
							Registry.application.modal.show(
								new ErrorView({
									message: response.responseText
								})
							);					
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

			// check compatibility and save assessment
			//
			assessmentRun.checkCompatibility({
				data: assessmentRun.attributes,

				// callbacks
				//
				success: function() {
					if (selectedTool) {
						self.saveWithPermission(assessmentRun, selectedTool, options);
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

						Registry.application.modal.show(
							new ConfirmView({
								title: "Save Incompatible Assessment",
								message: message,

								// callbacks
								//
								accept: function() {
									self.saveIncompatible(assessmentRun);
								},
							})
						);
					} else {

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not save this assessment."
							})
						);
					}
				}
			});
		},

		scheduleOneTimeRunRequest: function(assessmentRun, notifyWhenComplete) {
			var self = this;
			var runRequest = new RunRequest();
			var assessmentRunUuid = assessmentRun.get('assessment_run_uuid');

			if (typeof assessmentRunUuid == 'string') {
				var assessmentRunUuids = [assessmentRunUuid];
			} else {
				var assessmentRunUuids = assessmentRunUuid;
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
					Backbone.history.navigate('#results' + (queryString != ''? '?' + queryString : ''), {
						trigger: true
					});
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save run request assoc."
						})
					);		
				}
			});
		},

		run: function(assessmentRun) {
			var self = this;
			
			// show confirm dialog box
			//
			Registry.application.modal.show(
				new ConfirmRunRequestView({
					selectedAssessmentRuns: [assessmentRun],

					// callbacks
					//
					accept: function(selectedAssessmentRuns, notifyWhenComplete) {
						self.scheduleOneTimeRunRequest(assessmentRun, notifyWhenComplete);
					},

					reject: function() {
						self.enableButtons();
					}
				})
			);
		},

		//
		// triplet querying methods
		//

		getProject: function() {
			if (this.options.data['project']) {

				// return fixed project
				//
				return this.options.data['project'];
			} else if (this.projectSelector.currentView) {

				// return selected project
				//
				return this.projectSelector.currentView.getSelected();
			} else {

				// return default project
				//
				return this.options.project;
			}
		},

		getPackage: function() {
			if (this.options.data['package']) {

				// return fixed package
				//
				return this.options.data['package'];
			} else if (this.packageSelector.currentView) {

				// return selected package
				//
				return this.packageSelector.currentView.getSelected();
			}
		},

		getPackageVersion: function() {
			if (this.options.data['package-version']) {

				// return fixed package version
				//
				return this.options.data['package-version'] != 'latest'? this.options.data['package-version'] : undefined;
			} else if (this.packageVersionSelector.currentView) {

				// return selected package version
				//
				return this.packageVersionSelector.currentView.getSelected();
			}
		},

		getTool: function() {
			if (this.options.data['tool']) {

				// return fixed tool
				//
				return this.options.data['tool']
			} else if (this.toolSelector.currentView) {

				// return selected tool
				//
				return this.toolSelector.currentView.getSelected();
			}
		},

		getToolVersion: function() {
			if (this.options.data['tool-version']) {

				// return fixed tool version
				//
				return this.options.data['tool-version'] != 'latest'? this.options.data['tool-version'] : undefined;
			} else if (this.toolVersionSelector.currentView) {

				// return selected tool version
				//
				return this.toolVersionSelector.currentView.getSelected();
			}
		},

		getPlatform: function() {
			if (this.options.data['platform']) {

				// return fixed platform
				//
				return this.options.data['platform']
			} else if (this.platformSelector.currentView) {

				// return selected platform
				//
				return this.platformSelector.currentView.getSelected();
			}
		},

		getPlatformVersion: function() {
			if (this.options.data['platform-version']) {

				// return fixed platform version
				//
				return this.options.data['platform-version'] != 'latest'? this.options.data['platform-version'] : undefined;
			} else if (this.platformVersionSelector.currentView) {

				// return selected platform version
				//
				return this.platformVersionSelector.currentView.getSelected();
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
			} else if (this.options.data['package']) {
				queryString = addQueryString(queryString, 'package=' + this.options.data['package'].get('package_uuid'));
			}
			if (this.options.data['tool-version']) {
				queryString = addQueryString(queryString, 'tool-version=' + (this.options.data['tool-version'] != 'latest'? this.options.data['tool-version'].get('tool_version_uuid') : 'latest'));
			} else if (this.options.data['tool']) {
				queryString = addQueryString(queryString, 'tool=' + this.options.data['tool'].get('tool_uuid'));
			}
			if (this.options.data['platform-version']) {
				queryString = addQueryString(queryString, 'platform-version=' + (this.options.data['platform-version'] != 'latest'? this.options.data['platform-version'].get('platform_version_uuid') : 'latest'));
			} else if (this.options.data['platform']) {
				queryString = addQueryString(queryString, 'platform=' + this.options.data['platform'].get('platform_uuid'));
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				hasProjects: Registry.application.session.user.get('has_projects'),
				project: this.options.data['project'],
				package: this.options.data['package'],
				packageVersion: this.options.data['package-version'],
				tool: this.options.data['tool'],
				toolVersion: this.options.data['tool-version'],
				platform: this.options.data['platform'],
				platformVersion: this.options.data['platform-version']
			}));
		},

		onRender: function() {

			// show child views
			//
			this.showSelectors();
		},

		showSelectors: function() {
			var self = this;

			// create selectors
			//
			if (Registry.application.session.user.get('has_projects')) {
				this.projectSelectorView = new ProjectSelectorView({
					collection: self.options.projects,
					initialValue: this.options.data['project'] || this.options.project,

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
			}
			this.packageSelectorView = new PackageSelectorView([], {
				project: this.getProject(),
				initialValue: this.options.data['package'],
				initialVersion: this.options.data['package-version'] != 'latest'? this.options.data['package-version'] : undefined,
				versionSelector: this.packageVersionSelector,
				showPlatformDependent: (this.options.data['platform'] != undefined
					|| this.options.data['platform'] != undefined),

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
			this.toolSelectorView = new ToolSelectorView([], {
				project: this.getProject(),
				initialValue: this.options.data['tool'],
				initialVersion: this.options.data['tool-version'] != 'latest'? this.options.data['tool-version'] : undefined,
				packageSelected: this.options.data['package'],
				platformSelected: this.options.data['platform'],
				versionSelector: this.toolVersionSelector,
				addAssessmentView: this,

				// callbacks
				//
				onChange: function(changes) {
					self.$el.find('#platform-selection').show();
					self.platformSelectorView.setTool(changes.tool);
				}
			});
			this.platformSelectorView = new PlatformSelectorView([], {
				project: this.getProject(),
				initialValue: this.options.data['platform'],
				initialVersion: this.options.data['platform-version'] != 'latest'? this.options.data['platform-version'] : undefined,
				packageSelected: this.options.data['package'],
				toolSelected: this.options.data['tool'],
				versionSelector: this.platformVersionSelector,

				// callbacks
				//
				onChange: function(changes) {
					self.onChange();
				}
			});

			// show selectors
			//
			this.projectSelector.show(this.projectSelectorView);
			this.packageSelector.show(this.packageSelectorView);
			this.toolSelector.show(this.toolSelectorView);
			this.platformSelector.show(this.platformSelectorView);
		},

		//
		// event handling methods
		//

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

			// update model
			//
			this.update(this.model);

			// save assessment
			//
			this.save(this.model, {

				// callbacks
				//
				success: function() {
					var queryString = self.getPackageQueryString();

					// go to my assessments view
					//
					Backbone.history.navigate('#assessments' + (queryString != ''? '?' + queryString : ''), {
						trigger: true
					});
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save this assessment."
						})
					);			
				}
			});
		},

		onClickSaveAndRun: function() {
			var self = this;
			
			// update model
			//
			this.update(this.model);

			// save assessment
			//
			this.save(this.model, {

				// callbacks
				//
				success: function() {
					self.run(self.model);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not save this assessment."
						})
					);
				}
			});
		},

		onClickCancel: function() {
			history.back();
			
			/*
			var queryString = this.getQueryString();

			// go assessments view
			//
			Backbone.history.navigate('#assessments' + (queryString != ''? '?' + queryString : ''), {
				trigger: true
			});
			*/
		}
	});
});
