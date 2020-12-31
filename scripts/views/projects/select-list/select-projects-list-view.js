/******************************************************************************\
|                                                                              |
|                           select-projects-list-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a selectable list of projects.      |
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
	'text!templates/projects/select-list/select-projects-list.tpl',
	'collections/projects/projects',
	'views/projects/list/projects-list-view',
	'views/projects/select-list/select-projects-list-item-view'
], function($, _, Template, Projects, ProjectsListView, SelectProjectsListItemView) {
	return ProjectsListView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		childView: SelectProjectsListItemView,

		//
		// constructor
		//

		initialize: function() {

			// set optional parameter defaults
			//
			if (this.options.enabled === undefined) {
				this.options.enabled = true;
			}
		},

		//
		// querying methods
		//

		isEnabled: function() {
			return this.options.enabled;
		},

		//
		// setting methods
		//

		setEnabled: function(enabled) {
			if (this.options.enabled !== enabled) {
				this.options.enabled = enabled;
				if (enabled) {
					this.enable();
				} else {
					this.disable();
				}
			}
		},

		enable: function() {
			this.$el.find('input').removeAttr('disabled');
		},

		disable: function() {
			this.$el.find('input').attr('disabled', 'disabled');
		},

		selectAll: function() {
			this.$el.find('input').attr('checked');
		},

		deselectAll: function() {
			this.$el.find('input').removeAttr('checked');
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				collection: this.collection,
				selectedProjectsUuids: this.options.selectedProjectsUuids
			};
		},

		viewFilter: function(view, index, children) {
			return !view.model.isTrialProject() || this.options.showTrialProjects;
		},

		onRender: function() {

			// call superclass method
			//
			ProjectsListView.prototype.onRender.call(this);

			// perform selection
			//
			if (this.options.selectedProjectsUuids) {
				this.selectProjectsByUuids(this.options.selectedProjectsUuids);
			}
			if (!this.options.enabled) {
				this.disable();
			}
		},

		// 
		// methods
		//

		selectProjectsByUuids: function(uuids) {
			for (var i = 0; i < uuids.length; i++) {
				this.selectProjectByUuid(uuids[i]);
			}		
		},

		selectProjectByUuid: function(uuid) {
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children.findByIndex(i);
				if (child.model.get('project_uid') === uuid) {
					child.setSelected(true);
				}
			}		
		},

		getSelected: function() {
			var collection = new Projects();
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children.findByIndex(i);
				if (child.isSelected()) {
					collection.add(child.model);
				}
			}
			return collection;
		}
	});
});