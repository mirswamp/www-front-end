 /******************************************************************************\
|                                                                              |
|                             project-selector-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting a software project from a list.     |
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
	'models/projects/project',
	'collections/projects/projects',
	'views/widgets/selectors/grouped-name-selector-view'
], function($, _, Project, Projects, GroupedNameSelectorView) {
	return GroupedNameSelectorView.extend({

		//
		// constructor
		//

		initialize: function(options) {
			var self = this;
			
			// set name attribute of initially selected project
			//
			if (options.initialValue) {
				if (options.initialValue.isTrialProject()) {
					options.initialValue.name = 'Default';
				} else {
					options.initialValue.set({
						'name': options.initialValue.get('full_name')
					});
				}
			}

			// call superclass method
			//
			GroupedNameSelectorView.prototype.initialize.call(this, options);

			// set attributes
			//
			this.options = options;

			// fetch projects
			//
			if (!this.collection) {
				this.collection = new Projects();
				this.collection.fetch({

					// callbacks
					//
					success: function(collection) {
						self.setProjects(collection);
					},

					error: function() {

						// show error message
						//
						application.error({
							message: "Could not fetch projects."
						});
					}
				});
			} else {
				this.setProjects(this.collection);
			}
		},

		//
		// methods
		//

		setProjects: function(collection, options) {
			var currentUser = application.session.user;
			var ownedProjects = collection.getOwnedBy(currentUser);
			var joinedProjects = collection.getNotOwnedBy(currentUser);

			// remove trial project from list
			//
			// ownedProjects = ownedProjects.getNonTrialProjects();

			// get names to display
			//
			for (var i = 0; i < ownedProjects.length; i++) {
				ownedProjects.at(i).set({
					name: ownedProjects.at(i).get('full_name')
				});
			}
			for (var j = 0; j < joinedProjects.length; j++) {
				joinedProjects.at(j).set({
					name: joinedProjects.at(j).get('full_name')
				});
			}

			// set attributes
			//
			if (this.options.allowAny) {
				this.collection = new Backbone.Collection([{
					name: 'Any',
					model: null
				}, {
					name: 'Projects I Own',
					group: ownedProjects
				}, {
					name: 'Projects I Joined',
					group: joinedProjects
				}]);
			} else {
				this.collection = new Backbone.Collection([{
					name: 'Projects I Own',
					group: ownedProjects
				}, {
					name: 'Projects I Joined',
					group: joinedProjects
				}]);
			}
			
			// render
			//
			this.render();
		},

		setSelected: function(project, options) {
			this.selected = project;
			if (project) {
				this.setSelectedName(project.get('full_name'), options);
			} else {
				this.setSelectedName('Any', options);
			}
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				selected: this.options.initialValue
			};
		},

		//
		// event handling methods
		//

		onChange: function(options) {

			// update selected
			//
			this.selected = this.getItemByIndex(this.getSelectedIndex());

			// perform callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange({
					'project': this.selected
				});
			}
		}
	});
});
