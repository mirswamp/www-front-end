/******************************************************************************\
|                                                                              |
|                                    project.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a SWAMP project.                              |
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
	'config',
	'models/utilities/timestamped',
	'models/users/user'
], function($, _, Config, Timestamped, User) {
	return Timestamped.extend({

		//
		// attributes
		//

		defaults: {
			'full_name': undefined,
			'project_type_code': undefined,
			'affiliation': undefined,
			'description': undefined
		},

		projectTypeCodes: [
			'SW_DEV',
			'TESTING_TOOL',
			'EDU',
			'RESEARCH'
		],

		//
		// Backbone attributes
		//

		idAttribute: 'project_uid',
		urlRoot: Config.servers.web + '/projects',

		//
		// methods
		//

		projectTypeCodeToStr: function(projectTypeCode) {
			switch (projectTypeCode) {
				case 'SW_DEV':
					return 'Software Development';
				case 'TESTING_TOOL':
					return 'Testing Tool';
				case 'EDU':
					return 'Education';
				case 'RESEARCH':
					return 'Research';
            }
		},

		//
		// querying methods
		//

		getName: function() {
			if (!this.isTrialProject()) {
				return this.get('full_name');
			} else {
				return '';
			}
		},

		getProjectTypeStr: function() {
			return this.projectTypeCodeToStr(this.get('project_type_code'));
		},

		isDeactivated: function() {
			return (this.has('deactivation_date') || this.hasDeleteDate());
		},

		isTrialProject: function() {
			return (this.has('trial_project_flag') && this.get('trial_project_flag') == true);
		},

		isSameAs: function(project) {
			return project && this.get('project_uid') == project.get('project_uid');
		},

		allowPublicTools: function() {
			return !this.get('exclude_public_tools_flag');
		},

		//
		// ownership methods
		//

		isOwned: function() {
			return this.isOwnedBy(application.session.user);		
		},

		isOwnedBy: function(user) {
			if (user && this.has('owner')) {
				var owner = this.get('owner');
				return (owner.get('user_uid') == user.get('user_uid'));
			} else {
				return false;
			}
		},

		isOwnedByMember: function(membership) {
			if (membership && this.has('owner')) {
				var owner = this.get('owner');
				return (owner.get('user_uid') == membership.get('user_uid'));
			} else {
				return false;
			}
		},

		//
		// admin status methods
		//

		getStatus: function() {
			return this.isDeactivated() ? 'deactivated' : 'activated';
		},

		setStatus: function(status) {
			switch (status) {
				case 'deactivated':
					this.set({
						deactivation_date: new Date()
					});
					break;
				case 'activated':
					this.set({
						deactivation_date: null
					});
					break;
			}
		},

		//
		// ajax methods
		//

		deleteCurrentMember: function(options) {
			this.deleteMember(application.session.user, options);
		},

		deleteMember: function(member, options) {
			$.ajax(_.extend(options, {
				url: Config.servers.web + '/memberships/projects/' + this.get('project_uid') + '/users/' + member.get('user_uid'),
				type: 'DELETE'
			}));
		},

		fetchProjectConfirmation: function(options) {
			options.url = this.urlRoot + '/' + this.get('project_uid') + '/confirm'; 
			return Backbone.Model.prototype.fetch.call( this, options );
		},

		fetchTrialByUser: function(user, options) {
			return $.ajax(_.extend(options, {
				url: Config.servers.web + '/users/' + user.get('user_uid') + '/projects/trial',
				type: 'GET',
				dataType: 'json'
			}));
		},

		fetchCurrentTrial: function(options) {
			if (application.session.user) {
				this.fetchTrialByUser(application.session.user, options);
			} else {
				application.sessionExpired();
			}
		},

		//
		// overridden Backbone methods
		//

		parse: function(response) {

			// call superclass method
			//
			response = Timestamped.prototype.parse.call(this, response);

			// convert dates from strings to objects
			//
			if (response.deactivation_date) {
				response.deactivation_date = new Date(Date.parseIso8601(response.deactivation_date));
			}
			if (response.owner) {
				response.owner = new User(response.owner);
			}

			return response;
		},

		toJSON: function() {
			return _.omit(this.attributes, ['owner']);
		}
	});
});
