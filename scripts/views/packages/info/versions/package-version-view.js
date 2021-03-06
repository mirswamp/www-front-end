/******************************************************************************\
|                                                                              |
|                            package-version-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package version's information.    |
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
	'text!templates/packages/info/versions/package-version.tpl',
	'collections/projects/projects',
	'collections/assessments/assessment-runs',
	'collections/assessments/execution-records',
	'collections/assessments/scheduled-runs',
	'views/base-view'
], function($, _, Template, Projects, AssessmentRuns, ExecutionRecords, ScheduledRuns, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			info: '#package-version-info'
		},

		events: {
			'click #assessments': 'onClickAssessments',
			'click #results': 'onClickResults',
			'click #runs': 'onClickRuns',
			'click #details': 'onClickDetails',
			'click #source': 'onClickSource',
			'click #build': 'onClickBuild',
			'click #compatibility': 'onClickCompatibility',
			'click #sharing': 'onClickSharing'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				nav: this.options.nav,
				is_owned: this.options.package.isOwned(),
				url: this.options.package.getAppUrl(),
				name: this.options.package.get('name')
			};
		},

		onRender: function() {
			var self = this;

			// fetch projects and add badges for projects info
			//
			var projects = new Projects();
			projects.fetch({

				// callbacks
				//
				success: function() {

					// determine whether or not to display sharing
					//
					var showSharing = projects.length > 1 && (self.options.package.get('is_owned') || application.session.user.isAdmin());

					// hide / show sharing tab
					//
					if (showSharing) {
						self.$el.find('li#sharing').show();
					} else {
						self.$el.find('li#sharing').hide();
					}

					// show num projects
					//
					self.addBadges(projects);
				}
			});
		},

		//
		// badge rendering methods
		//

		addBadge: function(selector, num) {
			if (num > 0) {
				this.$el.find(selector).append('<span class="badge">' + num + '</span>');
			} else {
				this.$el.find(selector).append('<span class="badge badge-important">' + num + '</span>');
			}
		},

		addNumAssessmentsBadge: function(projects) {
			var self = this;
			if (projects.length > 0) {
				AssessmentRuns.fetchNumByProjects(projects, {
					data: {
						package_version_uuid: this.model.get('package_version_uuid')
					},
					success: function(number) {
						self.addBadge("#assessments", number);
					}
				});
			} else {
				this.addBadge("#assessments", 0);
			}
		},

		addNumResultsBadge: function(projects) {
			var self = this;
			if (projects.length > 0) {
				ExecutionRecords.fetchNumByProjects(projects, {
					data: {
						package_version_uuid: this.model.get('package_version_uuid')
					},
					success: function(number) {
						self.addBadge("#results", number);
					}
				});
			} else {
				this.addBadge("#results", 0);
			}
		},

		addNumRunsBadge: function(projects) {
			var self = this;
			if (projects.length > 0) {
				ScheduledRuns.fetchNumByProjects(projects, {
					data: {
						package_version_uuid: this.model.get('package_version_uuid')
					},
					success: function(number) {
						self.addBadge("#runs", number);
					}
				});
			} else {
				this.addBadge("#runs", 0);
			}			
		},

		addBadges: function(projects) {
			this.addNumAssessmentsBadge(projects);
			this.addNumResultsBadge(projects);
			this.addNumRunsBadge(projects);
		},

		//
		// event handling methods
		//

		onClickAssessments: function() {

			// go to assessments view
			//
			application.navigate('#assessments?package-version=' + this.model.get('package_version_uuid'));
		},

		onClickResults: function() {

			// go to assessment results view
			//
			application.navigate('#results?package-version=' + this.model.get('package_version_uuid'));
		},

		onClickRuns: function() {

			// go to run requests view
			//
			application.navigate('#run-requests?package-version=' + this.model.get('package_version_uuid'));
		},

		onClickDetails: function() {

			// go to package version details view / tab
			//
			application.navigate('#packages/versions/' + this.model.get('package_version_uuid'));
		},

		onClickSource: function() {

			// go to package version source view / tab
			//
			application.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/source');
		},

		onClickBuild: function() {

			// go to package version build view / tab
			//
			application.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/build');
		},

		onClickCompatibility: function() {

			// go to package version compatibility view / tab
			//
			application.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/compatibility');	
		},

		onClickSharing: function() {

			// go to package version sharing view / tab
			//
			application.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/sharing');
		}
	});
});
