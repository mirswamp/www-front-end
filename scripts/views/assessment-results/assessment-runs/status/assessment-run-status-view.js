/******************************************************************************\
|                                                                              |
|                            assessment-run-status-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a single assessment run.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/assessment-results/assessment-runs/status/assessment-run-status.tpl',
	'registry',
	'views/assessment-results/assessment-runs/assessment-run-profile/assessment-run-profile-view',
	'views/dialogs/confirm-view',
	'views/dialogs/error-view'
], function($, _, Backbone, Marionette, Template, Registry, AssessmentRunProfileView, ConfirmView, ErrorView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		refreshInterval: 5000,

		regions: {
			assessmentRunProfile: '#assessment-run-profile'
		},

		events: {
			'click #refresh': 'onClickRefresh',
			'click #auto-refresh': 'onClickAutoRefresh',
			'click #ok': 'onClickOk',
			'click #kill': 'onClickKill',
			'click #delete': 'onClickDelete'
		},

		//
		// refresh methods
		//

		enableAutoRefresh: function() {
			this.$el.find('button#refresh').hide();
			this.scheduleNextRefresh();
		},

		disableAutoRefresh: function() {
			this.$el.find('button#refresh').show();
			window.clearTimeout(this.timeout);
		},

		scheduleNextRefresh: function() {
			var self = this;
			if (this.model) {
				this.timeout = window.setTimeout(function() {
					self.showRefreshingStatus();
				}, this.refreshInterval);
			}
		},

		showRefreshingStatus: function() {
			var self = this;
			if (this.model) {
				this.fetchAndUpdateStatus(function() {

					// set up next refresh
					//
					if (self.getAutoRefresh()) {
						self.scheduleNextRefresh();
					}
				});
			}
		},

		fetchAndUpdateStatus: function(done) {
			var self = this;

			if (!this.model) {

				// update view
				//
				this.update();

				// perform callback
				//
				if (done) {
					done();
				}

				return;
			}

			this.model.fetch({

				// callbacks
				//
				success: function(data) {

					// update view
					//
					self.update();

					// perform callback
					//
					if (done) {
						done();
					}
				},

				error: function() {
					self.model = null;

					// update view
					//
					self.update();

					// perform callback
					//
					if (done) {
						done();
					}
				}
			});
		},

		//
		// querying methods
		//

		getAutoRefresh: function() {
			return this.$el.find('#auto-refresh').is(':checked');
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				project: this.options.project,
				queryString: this.options.queryString,
				autoRefresh: Registry.application.options.autoRefresh,
				showKillButton: this.model.isKillable()
			}));
		},

		onRender: function() {
			this.showAssessmentRunProfile();

			// schedule next refresh
			//
			if (this.model) {
				this.scheduleNextRefresh();
			}
		},

		showAssessmentRunProfile: function() {
			if (this.model) {
				this.assessmentRunProfile.show(
					new AssessmentRunProfileView({
						model: this.model
					})
				);
			} else {
				this.$el.find('#assessment-run-profile').html("No execution record found.");	
			}	
		},

		update: function() {
			this.showAssessmentRunProfile();

			// show / hide delete button
			//
			if (this.model) {
				this.$el.find('#delete').show();
			} else {
				this.$el.find('#delete').hide();
			}

			// show / hide kill button
			//
			if (this.model.isKillable()) {
				this.$el.find('#kill').show();
			} else {
				this.$el.find('#kill').hide();
			}
		},

		//
		// event handling methods
		//

		onClickRefresh: function() {
			this.fetchAndUpdateStatus();
		},

		onClickAutoRefresh: function(event) {

			// store refresh in cookie
			//
			Registry.application.setAutoRefresh(this.getAutoRefresh());

			// enable / disable refresh
			//
			if (Registry.application.options.autoRefresh) {
				this.enableAutoRefresh();
			} else {
				this.disableAutoRefresh();
			}
		},

		onClickOk: function() {
			var queryString = this.options.queryString;

			if (!Registry.application.session.user.isAdmin()) {

				// go to assessment results view
				//
				Backbone.history.navigate('#results' + (queryString && queryString != ''? '?' + queryString : ''), {
					trigger: true
				});
			} else {

				// go to results overview view
				//
				Backbone.history.navigate('#results/review' + (queryString && queryString != ''? '?' + queryString : ''), {
					trigger: true
				});		
			}
		},

		onClickKill: function() {
			var self = this;
			Registry.application.modal.show(
				new ConfirmView({
					title: "Kill Assessment Run",
					message: "Are you sure you want to kill / stop this assessment run?",

					// callbacks
					//
					accept: function() {
						self.model.kill({

							// callbacks
							//
							success: function() {
								self.update();
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not kill assessment run."
									})
								);
							}
						});
					}
				})
			);
		},

		onClickDelete: function() {
			var self = this;
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete Assessment Run",
					message: "Are you sure you want to delete this assessment run?",

					// callbacks
					//
					accept: function() {
						var copy = self.model.clone();
						self.model.destroy({

							// callbacks
							//
							success: function() {
								self.model = copy;
								self.update();
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete assessment run."
									})
								);
							}
						});
					}
				})
			);
		},

		//
		// cleanup methods
		//

		onBeforeDestroy: function() {
			if (this.timeout) {
				window.clearTimeout(this.timeout);
			}		
		}
	});
});