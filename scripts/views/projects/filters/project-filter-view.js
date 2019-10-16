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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap/collapse',
	'text!templates/projects/filters/project-filter.tpl',
	'views/base-view',
	'views/projects/selectors/project-selector-view'
], function($, _, Collapse, Template, BaseView, ProjectSelectorView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		
		regions: {
			selector: '.name-selector'
		},

		events: {
			'click #reset': 'onClickReset'
		},

		maxTagLength: 40,

		//
		// constructor
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
			var selectedName = this.getChildView('selector').getSelectedName();
			if (selectedName == 'Any') {
				return undefined;
			} else if (selectedName == 'Default') {
				return this.model;
			} else {
				return this.selected;
			}
		},

		getDescription: function() {
			if (this.hasSelected()) {
				return this.getSelected().get('full_name');
				/*
				var project = this.getSelected();
				if (project == null || project.isTrialProject()) {
					return 'default project';
				} else {
					return this.getSelected().get('full_name');
				}
				*/
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
			var description = this.getDescription();
			return this.tagify(description? description.truncatedTo(this.maxTagLength) : '?');
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
			var selectedName = this.getChildView('selector').getSelectedName();

			if (selectedName == 'Any') {
				return;
			} else if (selectedName == 'Default') {
				return 'project=default';
			} else {

				// add project uuid
				//
				if (this.hasSelected()) {
					if (this.getSelected().isTrialProject()) {
						queryString = 'project=default';
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
			this.getChildView('selector').setSelected(this.options.defaultValue, {
				silent: true
			});
			this.onChange(options);
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;

			// show subviews
			//
			this.showChildView('selector', new ProjectSelectorView({
				model: this.model,
				initialValue: this.options.initialValue,
				allowAny: true,

				// callbacks
				//
				onChange: function() {
					self.onChange();
				}
			}));

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
			this.selected = this.getChildView('selector').getSelected();

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