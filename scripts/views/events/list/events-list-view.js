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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'registry',
	'text!templates/events/list/events-list.tpl',
	'models/events/project-event',
	'models/events/user-project-event',
	'models/events/user-personal-event',
	'views/dialogs/error-view',
	'views/widgets/lists/sortable-table-list-view',
	'views/events/list/events-list-item-view',
	'views/events/project-events/project-created-event-view',
	'views/events/project-events/project-approved-event-view',
	'views/events/project-events/project-rejected-event-view',
	'views/events/project-events/project-revoked-event-view',
	'views/events/project-events/project-deleted-event-view',
	'views/events/user-project-events/join-project-event-view',
	'views/events/user-project-events/leave-project-event-view',
	'views/events/user-personal-events/user-registered-event-view',
	'views/events/user-personal-events/user-last-login-event-view',
	'views/events/user-personal-events/user-last-profile-update-event-view'
], function($, _, Backbone, Marionette, Registry, Template, ProjectEvent, UserProjectEvent, UserPersonalEvent, ErrorView, SortableTableListView, EventsListItemView, ProjectCreatedEventView, ProjectApprovedEventView, ProjectRejectedEventView, ProjectRevokedEventView, ProjectDeletedEventView, JoinProjectEventView, LeaveProjectEventView, UserRegisteredEventView, UserLastLoginEventView, UserLastProfileUpdateEventView) {
	return SortableTableListView.extend({

		//
		// attributes
		//

		childView: EventsListItemView,

		sorting: {

			// sort on date column in descending order 
			//
			sortList: [[1, 1]]
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				collection: this.collection,
				showNumbering: this.options.showNumbering,
				showDelete: this.options.showDelete
			}));
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
						model: projectEvent,
						showNumbering: this.options.showNumbering
					});
					break;
				case 'approved':
					view = new ProjectApprovedEventView({
						model: projectEvent,
						showNumbering: this.options.showNumbering
					});	
					break;
				case 'rejected':
					view = new ProjectRejectedEventView({
						model: projectEvent,
						showNumbering: this.options.showNumbering
					});	
					break;
				case 'revoked':
					view = new ProjectRevokedEventView({
						model: projectEvent,
						showNumbering: this.options.showNumbering
					});	
					break;
				case 'deleted':
					view = new ProjectDeletedEventView({
						model: projectEvent,
						showNumbering: this.options.showNumbering
					});
					break;
				default:

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Unrecognized project event: " + eventType
						})
					);
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
						model: userProjectEvent,
						showNumbering: this.options.showNumbering
					});
					break;
				case 'leave':
					view = new LeaveProjectEventView({
						model: userProjectEvent,
						showNumbering: this.options.showNumbering
					});	
					break;
				default:

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Unrecognized user project event type: " + eventType
						})
					);
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
						model: userPersonalEvent,
						showNumbering: this.options.showNumbering
					});
					break;
				case 'last_login':
					view = new UserLastLoginEventView({
						model: userPersonalEvent,
						showNumbering: this.options.showNumbering
					});	
					break;
				case 'last_profile_update':
					view = new UserLastProfileUpdateEventView({
						model: userPersonalEvent,
						showNumbering: this.options.showNumbering
					});	
					break;
				default:

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Unrecognized user personal event type: " + eventType
						})
					);
					break;
			}

		    return view;
		},

		//
		// rendering methods
		//

		buildChildView: function(item){
			var view;

			// create project event views
			//
			if (item instanceof ProjectEvent) {
				view = this.getProjectEventView(item);
			} else if (item instanceof UserProjectEvent) {
				view = this.getUserProjectEventView(item);
			} else if (item instanceof UserPersonalEvent) {
				view = this.getUserPersonalEventView(item);
			} else {

				// show error dialog
				//
				Registry.application.modal.show(
					new ErrorView({
						message: "Unrecognized event type"
					})
				);			
			}

			return view;
		}
	});
});
