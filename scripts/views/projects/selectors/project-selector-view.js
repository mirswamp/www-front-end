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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/widgets/selectors/grouped-name-selector.tpl',
	'registry',
	'models/projects/project',
	'collections/projects/projects',
	'views/dialogs/error-view',
	'views/widgets/selectors/grouped-name-selector-view'
], function($, _, Backbone, Template, Registry, Project, Projects, ErrorView, GroupedNameSelectorView) {
	return GroupedNameSelectorView.extend({

		//
		// methods
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

						// show error dialog
						//
						Registry.application.modal.show(
							new ErrorView({
								message: "Could not fetch projects."
							})
						);			
					}
				});
			} else {
				this.setProjects(this.collection);
			}
		},

		setProjects: function(collection, options) {
			var currentUser = Registry.application.session.user;
			var ownedProjects = collection.getOwnedBy(currentUser);
			var joinedProjects = collection.getNotOwnedBy(currentUser);

			// remove trial project from list
			//
			// ownedProjects = ownedProjects.getNonTrialProjects();

			// get names to display
			//
			for (var i = 0; i < ownedProjects.length; i++) {
				ownedProjects.at(i).set({
					'name': ownedProjects.at(i).get('full_name')
				});
			}
			for (var i = 0; i < joinedProjects.length; i++) {
				joinedProjects.at(i).set({
					'name': joinedProjects.at(i).get('full_name')
				});
			}

			// set attributes
			//
			if (this.options.allowAny) {
				this.collection = new Backbone.Collection([{
					'name': 'Any',
					'model': null
				}, {
					'name': 'Projects I Own',
					'group': ownedProjects
				}, {
					'name': 'Projects I Joined',
					'group': joinedProjects
				}]);
			} else {
				this.collection = new Backbone.Collection([{
					'name': 'Projects I Own',
					'group': ownedProjects
				}, {
					'name': 'Projects I Joined',
					'group': joinedProjects
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				selected: this.options.initialValue
			}));
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
