/******************************************************************************\
|                                                                              |
|                              project-filter-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a project filter.                   |
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
	'collapse',
	'modernizr',
	'text!templates/projects/filters/project-filter.tpl',
	'views/projects/selectors/project-selector-view'
], function($, _, Backbone, Marionette, Collapse, Modernizr, Template, ProjectSelectorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			projectSelector: '.name-selector'
		},

		events: {
			'click #reset': 'onClickReset'
		},

		maxTagLength: 40,

		//
		// methods
		//

		initialize: function() {
			if (this.options.initialValue) {
				this.selected = this.options.initialValue;
			}
		},

		//
		// querying methods
		//

		isSet: function() {
			if (this.hasSelected()) {
				var selected = this.getSelected();
				return selected && !selected.isSameAs(this.options.defaultValue);
			} else {
				return false;
			}
		},

		hasSelected: function() {
			return this.getSelected() !== undefined;
		},

		getSelected: function() {
			var selectedName = this.projectSelector.currentView.getSelectedName();
			if (selectedName == 'Any') {
				return undefined;
			} else if (selectedName == 'None') {
				return this.model;
			} else {
				return this.selected;
			}
		},

		getDescription: function() {
			if (this.hasSelected()) {
				var project = this.getSelected();
				if (project == null || project.isTrialProject()) {
					return "no project";
				} else {
					return this.getSelected().get('short_name');
				}
			} else {
				return "any project";
			}
		},

		tagify: function(text) {
			return '<span class="tag' + (this.hasSelected()? ' primary' : '') + 
				' accordion-toggle" data-toggle="collapse" data-parent="#filters" href="#project-filter">' + 
				'<i class="fa fa-folder-open"></i>' + text + '</span>';
		},

		getTag: function() {
			return this.tagify(this.getDescription().truncatedTo(this.maxTagLength));
		},

		getData: function() {
			var data = {};

			// add project
			//
			if (this.hasSelected()) {
				data['project'] = this.getSelected();
			}

			return data;
		},

		getAttrs: function() {
			var attrs = {};

			// add project uuid
			//
			if (this.hasSelected()) {
				attrs.project_uuid = this.getSelected().get('project_uid');
			}

			return attrs;
		},

		getQueryString: function() {
			var queryString = '';
			var selectedName = this.projectSelector.currentView.getSelectedName();

			if (selectedName == 'Any') {
				return;
			} else if (selectedName == 'None') {
				return 'project=none';
			} else {

				// add project uuid
				//
				if (this.hasSelected()) {
					if (this.getSelected().isTrialProject()) {
						queryString = 'project=none';
					} else {
						queryString = 'project=' + this.getSelected().get('project_uid');
					}
				}
			}

			return queryString;	
		},

		//
		// setting methods
		//

		reset: function(options) {
			this.projectSelector.currentView.setSelected(this.options.defaultValue, {
				silent: true
			});
			this.onChange(options);
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {
			var self = this;

			// show subviews
			//
			this.projectSelector.show(
				new ProjectSelectorView([], {
					model: this.model,
					initialValue: this.options.initialValue,

					// callbacks
					//
					onChange: function() {
						self.onChange();
					}
				})
			);

			// update reset button
			//
			this.updateReset();
		},

		//
		// reset button related methods
		//

		showReset: function() {
			this.$el.find('#reset').show();
		},

		hideReset: function() {
			this.$el.find('#reset').hide();
		},

		updateReset: function() {
			if (this.isSet()) {
				this.showReset();
			} else {
				this.hideReset();
			}
		},

		//
		// event handling methods
		//

		onChange: function(options) {
			this.selected = this.projectSelector.currentView.getSelected();

			// update reset button
			//
			this.updateReset();
			
			// call on change callback
			//
			if (this.options && this.options.onChange && (!options || !options.silent)) {
				this.options.onChange({
					project: this.selected
				});
			}
		},

		onClickReset: function() {
			this.reset();
		}
	});
});