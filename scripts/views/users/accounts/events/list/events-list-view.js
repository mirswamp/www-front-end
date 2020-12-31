/******************************************************************************\
|                                                                              |
|                                  events-list-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list of events / activities.         |
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
	'text!templates/users/accounts/events/list/events-list.tpl',
	'models/events/project-event',
	'models/events/user-project-event',
	'models/events/user-personal-event',
	'views/base-view',
	'views/collections/tables/sortable-table-list-view',
	'views/users/accounts/events/list/events-list-item-view',
	'views/users/accounts/events/project-events/project-created-event-view',
	'views/users/accounts/events/project-events/project-approved-event-view',
	'views/users/accounts/events/project-events/project-rejected-event-view',
	'views/users/accounts/events/project-events/project-revoked-event-view',
	'views/users/accounts/events/project-events/project-deleted-event-view',
	'views/users/accounts/events/user-project-events/join-project-event-view',
	'views/users/accounts/events/user-project-events/leave-project-event-view',
	'views/users/accounts/events/user-personal-events/user-registered-event-view',
	'views/users/accounts/events/user-personal-events/user-last-login-event-view',
	'views/users/accounts/events/user-personal-events/user-last-profile-update-event-view'
], function($, _, Template, ProjectEvent, UserProjectEvent, UserPersonalEvent, BaseView, SortableTableListView, EventsListItemView, ProjectCreatedEventView, ProjectApprovedEventView, ProjectRejectedEventView, ProjectRevokedEventView, ProjectDeletedEventView, JoinProjectEventView, LeaveProjectEventView, UserRegisteredEventView, UserLastLoginEventView, UserLastProfileUpdateEventView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: EventsListItemView,

		emptyView: BaseView.extend({
			template: _.template("No events.")
		}),

		// sort by package column in descending order 
		//
		sortBy: ['date', 'descending'],
		index: 1,

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				showDelete: this.options.showDelete
			};
		},
		
		//
		// event view creation methods
		//

		getProjectEventView: function(projectEvent) {
			var view;
			var eventType = projectEvent.get('event_type').toLowerCase();

			// project events
			//
			switch (eventType) {
				case 'created': 
					view = new ProjectCreatedEventView({
						index: this.index++,
						model: projectEvent
					});
					break;
				case 'approved':
					view = new ProjectApprovedEventView({
						index: this.index++,
						model: projectEvent
					});	
					break;
				case 'rejected':
					view = new ProjectRejectedEventView({
						index: this.index++,
						model: projectEvent
					});	
					break;
				case 'revoked':
					view = new ProjectRevokedEventView({
						index: this.index++,
						model: projectEvent
					});	
					break;
				case 'deleted':
					view = new ProjectDeletedEventView({
						index: this.index++,
						model: projectEvent
					});
					break;
				default:

					// show error message
					//
					application.error({
						message: "Unrecognized project event: " + eventType
					});
					break;
			}

			return view;
		},

		getUserProjectEventView: function(userProjectEvent) {
			var view;
			var eventType = userProjectEvent.get('event_type').toLowerCase();

			// project events
			//
			switch (eventType) {
				case 'join': 
					view = new JoinProjectEventView({
						index: this.index++,
						model: userProjectEvent
					});
					break;
				case 'leave':
					view = new LeaveProjectEventView({
						index: this.index++,
						model: userProjectEvent
					});	
					break;
				default:

					// show error message
					//
					application.error({
						message: "Unrecognized user project event type: " + eventType
					});
					break;
			}

		    return view;
		},

		getUserPersonalEventView: function(userPersonalEvent) {
			var view;
			var eventType = userPersonalEvent.get('event_type').toLowerCase();

			// project events
			//
			switch (eventType) {
				case 'registered': 
					view = new UserRegisteredEventView({
						index: this.index++,
						model: userPersonalEvent
					});
					break;
				case 'last_login':
					view = new UserLastLoginEventView({
						index: this.index++,
						model: userPersonalEvent
					});	
					break;
				case 'last_profile_update':
					view = new UserLastProfileUpdateEventView({
						index: this.index++,
						model: userPersonalEvent
					});	
					break;
				default:

					// show error message
					//
					application.error({
						message: "Unrecognized user personal event type: " + eventType
					});
					break;
			}

		    return view;
		},

		//
		// rendering methods
		//

		buildChildView: function(child, ChildViewClass, childViewOptions) {
			var view;

			// create project event views
			//
			if (child instanceof ProjectEvent) {
				view = this.getProjectEventView(child);
			} else if (child instanceof UserProjectEvent) {
				view = this.getUserProjectEventView(child);
			} else if (child instanceof UserPersonalEvent) {
				view = this.getUserPersonalEventView(child);
			} else {

				// show error message
				//
				application.error({
					message: "Unrecognized event type"
				});
			}

			return view;
		}
	});
});
