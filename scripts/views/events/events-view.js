/******************************************************************************\
|                                                                              |
|                                   events-view.js                             |
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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/events/events.tpl',
	'registry',
	'models/projects/project',
	'collections/events/events',
	'collections/events/project-events',
	'collections/events/user-project-events',
	'collections/events/user-personal-events',
	'views/dialogs/error-view',
	'views/events/filters/event-filters-view',
	'views/events/list/events-list-view'
], function($, _, Backbone, Marionette, Template, Registry, Project, Events, ProjectEvents, UserProjectEvents, UserPersonalEvents, ErrorView, EventFiltersView, EventsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			eventFilters: '#event-filters',
			eventsList: '#events-list'
		},

		events: {
			'click #show-numbering': 'onClickShowNumbering'
		},

		template: _.template(Template),

		//
		// methods
		//

		initialize: function() {
			this.collection = new Events();
		},

		//
		// querying methods
		//

		getProject: function() {
			if (this.options.data['project']) {

				// check if a single project was specified
				//
				if (this.options.data['project'].constructor == Project) {
					return this.options.data['project'];
				}
			} else {

				// no project was specified
				//
				return this.model;	
			}
		},

		getQueryString: function() {
			return this.eventFilters.currentView.getQueryString();
		},

		getFilterData: function() {
			return this.eventFilters.currentView.getData();
		},

		getFilterAttrs: function() {
			return this.eventFilters.currentView.getAttrs();
		},

		//
		// ajax methods
		//

		fetchEvents: function(attrs, done) {
			var collection = new Events();
			var type = attrs['type'];
			delete attrs['type'];

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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.getProject(),
				showNumbering: Registry.application.options.showNumbering
			}));
		},

		onRender: function() {
			var self = this;
			
			// show event filters view
			//
			this.eventFilters.show(
				new EventFiltersView({
					model: this.model,
					data: this.options.data? this.options.data : {},

					// callbacks
					//
					onChange: function() {
						// setQueryString(self.eventFilters.currentView.getQueryString());			
					
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
				})
			);

			// show events
			//
			this.showList();
		},

		showList: function() {
			var self = this;

			// fetch events
			//
			this.fetchEvents(this.getFilterAttrs(), function(events) {

				// sort events based on date
				//
				events.sort();

				// apply limit
				//
				var limit = self.eventFilters.currentView.limitFilter.currentView.getLimit();
				if (limit) {
					var collection = new Events();
					for (var i = 0; i < limit; i++) {
						collection.add(events.at(i));
					}
					self.collection = collection;
				}

				// render events list
				//
				self.eventsList.show(
					new EventsListView({
						collection: self.collection,
						showNumbering: Registry.application.options.showNumbering
					})
				);
			});
		},

		//
		// event handling methods
		//

		onChange: function() {
			this.showList();
		},

		onClickShowNumbering: function(event) {
			Registry.application.setShowNumbering($(event.target).is(':checked'));
			this.showList();
		}
	});
});
