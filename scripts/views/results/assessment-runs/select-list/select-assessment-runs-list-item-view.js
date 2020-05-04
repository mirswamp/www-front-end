/******************************************************************************\
|                                                                              |
|                    select-assessment-runs-list-item-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single selectable run request       |
|        list item.                                                            |
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
	'text!templates/results/assessment-runs/select-list/select-assessment-runs-list-item.tpl',
	'config',
	'models/packages/package',
	'models/tools/tool',
	'models/permissions/user-policy',
	'models/assessments/assessment-results',
	'views/results/assessment-runs/list/assessment-runs-list-item-view',
	'utilities/time/date-utils'
], function($, _, Template, Config, Package, Tool, UserPolicy, AssessmentResults, AssessmentRunsListItemView) {
	return AssessmentRunsListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: _.extend(AssessmentRunsListItemView.prototype.events, {
			'click .select input': 'onClickSelectInput',
			'click .select-group input': 'onClickSelectGroupInput',
			'click .scarf-results': 'onClickScarfResults'
		}),

		//
		// selection methods
		//

		setSelected: function(selected) {
			if (selected) {
				this.$el.find('input[name="select"]').attr('checked', 'checked');
			} else {
				this.$el.find('input[name="select"]').removeAttr('checked');
			}
		},

		//
		// querying methods
		//

		isSelectable: function() {
			return Tool.prototype.isCompatibleWith.call(this.model.attributes.tool, this.options.viewer);
		},

		isSelected: function() {
			return this.$el.find('input[name="select"]').is(':checked');
		},
		
		//
		// rendering methods
		//

		templateContext: function() {
			return {
				isComplete: this.model.isComplete(),
				hasResults: this.model.hasResults(),
				hasErrors: this.model.hasErrors(),
				
				// urls
				//
				runUrl: this.getRunUrl(),
				projectUrl: this.getProjectUrl(),
				packageUrl: this.getPackageUrl(),
				packageVersionUrl: this.getPackageVersionUrl(),
				toolUrl: this.getToolUrl(),
				toolVersionUrl: this.getToolVersionUrl(),
				platformUrl: this.getPlatformUrl(),
				platformVersionUrl: this.getPlatformVersionUrl(),
				resultsUrl: this.getResultsUrl(),
				errorUrl: this.options.showErrors? this.getErrorUrl() : undefined,
				
				// options
				//
				isChecked: this.options.selected? this.options.selected.contains(this.model) : false,
				showSelect: this.options.editable || this.isViewable(),
				isSelectable: this.isSelectable(),
				showProjects: this.options.showProjects,
				showStatus: this.options.showStatus,
				showErrors: this.options.showErrors,
				showDelete: this.options.showDelete,
				showSsh: this.options.showSsh,
				sshEnabled: this.model.isVmReady() && application.session.user.hasSshAccess()
			};
		},

		onRender: function() {

			// show tooltips on hover
			//
			this.$el.find("[data-toggle='tooltip']").popover({
				trigger: 'hover'
			});
		},

		//
		// event handling methods
		//

		onClickSelectInput: function(event) {
			var index = this.options.parent.getSelectedElementIndex(event.target);
			var checked = $(event.target).prop('checked');

			// save index for shift clicking
			//
			var previousIndex = this.options.parent.clickedIndex;
			this.options.parent.clickedIndex = index;

			// check for shift clicking
			//
			if (this.options.parent.shiftClicking && previousIndex != undefined) {

				// select / deselect range
				//
				this.options.parent.setSelectedRange(previousIndex, index, checked);

				// end shift clicking
				//
				this.options.parent.shiftClicking = false;
			}

			// update parent view
			//
			/*
			var self = this;
			this.timeout = window.setTimeout(function() {
				self.options.parent.onSelect();
			}, 500);
			*/
			this.options.parent.onSelect();
		},

		onClickSelectGroupInput: function(event) {
			var index = this.options.parent.getSelectedGroupElementIndex(event.target);
			var checked = $(event.target).prop('checked');
			this.options.parent.setSelectedContiguous(index, checked);
			this.options.parent.onSelect();
		},

		onClickScarfResults: function(event) {
			var self = this;
			var href = $(event.target).closest('a').attr('href');

			// get results
			//
			var results = new AssessmentResults({
				assessment_result_uuid: this.model.get('assessment_result_uuid')
			}).fetch({

				// callbacks
				//
				success: function(data) {
					var tool = new Tool(self.model.get('tool'));
					var package = new Package(self.model.get('package'));

					// set policy code from results
					//
					tool.set({
						policy_code: data.get('policy_code')
					});

					if (tool.isRestricted()) {

						// cancel event
						//
						event.stopPropagation();
						event.preventDefault();

						// ensure the user has permission and has accepted any pertinent EULAs
						//
						new UserPolicy({
							policy_code: data.get('policy_code')
						}).confirm({

							// callbacks
							//
							success: function() {

								// update tool permission
								//
								var tool = self.model.get('tool');
								tool.permission = 'granted';
								self.model.set({
									tool: tool
								});

								// open resuls
								//
								window.open(href);
							}
						});
					} else {
						window.open(href);
					}
				},

				error: function() {

					//
					//
					application.error({
						message: "Could not get scarf results."
					});
				}
			});

			// cancel event
			//
			event.stopPropagation();
			event.preventDefault();
		}

		/*
		onDoubleClickInput: function(event) {
			var index = this.options.parent.getSelectedElementIndex(event.target);
			var checked = !$(event.target).prop('checked');
			this.options.parent.setSelectedContiguous(index, checked);
			window.clearTimeout(this.timeout);
		}
		*/
	});
});
