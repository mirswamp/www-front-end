/******************************************************************************\
|                                                                              |
|                                events-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a list a user events.                  |
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
	'text!templates/users/accounts/events/user-events.tpl',
	'models/projects/project',
	'collections/events/events',
	'collections/events/project-events',
	'collections/events/user-project-events',
	'collections/events/user-personal-events',
	'views/base-view',
	'views/users/accounts/events/filters/event-filters-view',
	'views/users/accounts/events/list/events-list-view'
], function($, _, Template, Project, Events, ProjectEvents, UserProjectEvents, UserPersonalEvents, BaseView, EventFiltersView, EventsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			filters: '#event-filters',
			list: '#events-list'
		},

		events: {
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// constructor
		//

		initialize: function() {

			// set optional parameter defaults
			//
			if (!this.options.data) {
				this.options.data = {};
			}

			// set attributes
			//
			this.collection = new Events();
		},

		//
		// querying methods
		//

		getProject: function() {
			if (this.options.data.project) {

				// check if a single project was specified
				//
				if (this.options.data.project.constructor == Project) {
					return this.options.data.project;
				}
			} else {

				// no project was specified
				//
				return this.model;	
			}
		},

		getQueryString: function() {
			return this.getChildView('filters').getQueryString();
		},

		getFilterData: function() {
			return this.getChildView('filters').getData();
		},

		getFilterAttrs: function() {
			return this.getChildView('filters').getAttrs();
		},

		//
		// ajax methods
		//

		fetchEvents: function(attrs, done) {
			var collection = new Events();
			var type = attrs.type;
			delete attrs.type;

			// fetch events
			//
			var projectEvents = new ProjectEvents();
			var userProjectEvents = new UserProjectEvents();
			var userPersonalEvents = new UserPersonalEvents();

			$.when(
				projectEvents.fetch({data: attrs}),
				userProjectEvents.fetch({data: attrs}),
				userPersonalEvents.fetch({data: attrs})
			).then(function() {

				// add events to collection
				//
				if (type) {
					switch (type) {
						case 'user':

							// add user events
							//
							collection.add(userPersonalEvents.toArray());
							break;
						case 'project':

							// add project events
							//
							collection.add(userProjectEvents.toArray());
							collection.add(projectEvents.toArray());
							break;
					}
				} else {

					// add all events
					//
					collection.add(projectEvents.toArray());
					collection.add(userProjectEvents.toArray());
					collection.add(userPersonalEvents.toArray());
				}

				// return events
				//
				done(collection);
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.getProject()
			};
		},

		onRender: function() {
			var self = this;

			// show event filters view
			//
			this.showChildView('filters', new EventFiltersView({
				model: this.model,
				data: this.options.data? this.options.data : {},

				// callbacks
				//
				onChange: function() {
				
					// update filter data
					//
					var projects = self.options.data.projects;
					self.options.data = self.getFilterData();
					self.options.data.projects = projects;

					// update url
					//
					var queryString = self.getQueryString();
					var state = window.history.state;
					var url = getWindowBaseLocation() + (queryString? ('?' + queryString) : '');
					window.history.pushState(state, '', url);

					// update view
					//
					self.onChange();
				}
			}));

			// show events
			//
			this.fetchAndShowList();
		},

		fetchAndShowList: function() {
			var self = this;

			// fetch events
			//
			this.fetchEvents(this.getFilterAttrs(), function(events) {

				// sort events based on date
				//
				events.sort();

				// apply limit
				//
				var limit = self.getChildView('filters').getChildView('limit').getLimit();
				if (limit) {
					var collection = new Events();
					for (var i = 0; i < limit; i++) {
						collection.add(events.at(i));
					}
					self.collection = collection;
				}

				// render
				//
				self.showList();
			});
		},

		showList: function() {

			// preserve existing sorting column and order
			//
			if (this.hasChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}
			
			// render events list
			//
			this.showChildView('list', new EventsListView({
				collection: this.collection,

				// options
				//
				sortBy: this.options.sortBy
			}));		
		},

		//
		// event handling methods
		//

		onChange: function() {
			this.fetchAndShowList();
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		}
	});
});
