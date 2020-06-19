/******************************************************************************\
|                                                                              |
|                               system-email-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing the system administrators.            |
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
	'bootstrap/popover',
	'text!templates/admin/settings/system-email/system-email.tpl',
	'models/users/user',
	'collections/users/users',
	'views/base-view',
	'views/admin/settings/system-email/system-email-form-view',
	'views/admin/settings/system-email/system-email-list/system-email-list-view',
	'views/layout/nav-button-bar-view',
	'views/dialogs/progress-dialog-view'
], function($, _, Popover, Template, User, Users, BaseView, SystemEmailFormView, SystemEmailListView, NavButtonBarView, ProgressDialogView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#system-email-list',
			nav: '.nav-button-bar',
			form: '#system-email-form'
		},

		events: {
			'click #show-inactive-accounts': 'onClickShowInactiveAccounts',
			'click #send-email': 'onClickSendEmail',
			'click #show-numbering': 'onClickShowNumbering',
			'keydown': 'onKeyDown',
			'keyup': 'onKeyUp'
		},

		pageNumber: 1,
		itemsPerPage: 100,
		batchSize: 10,
		groupSelected: false,

		//
		// constructor
		//

		initialize: function() {

			// set optional parameter defaults
			//
			if (this.options.showInactiveAccounts == undefined) {
				this.options.showInactiveAccounts = false;
			}
			if (this.options.showNumbering == undefined) {
				this.options.showNumbering = application.options.showNumbering;
			}

			// set attributes
			//
			this.collection = new Users();
		},

		//
		// querying methods
		//

		getWhiteList: function() {
			var whitelist = [];
			for (var i = 0; i < this.collection.length; i++) {
				if (this.collection.at(i).selected) {
					whitelist.push(this.collection.at(i));
				}
			}
			return whitelist;
		},

		getBlackList: function() {
			var blacklist = [];
			for (var i = 0; i < this.collection.length; i++) {
				if (!this.collection.at(i).selected) {
					blacklist.push(this.collection.at(i));
				}
			}
			return blacklist;
		},

		numItems: function() {
			return this.collection.length;
		},

		getItems: function(from, to) {
			var items = [];
			for (var i = from; i <= to; i++) {
				items.push(this.collection.at(i));
			}
			return items;
		},

		pageOf: function(itemIndex) {
			if (this.itemsPerPage) {
				return Math.floor((itemIndex - 1) / this.itemsPerPage) + 1;
			} else {
				return 1;
			}
		},

		numPages: function() {
			if (this.itemsPerPage) {
				return  Math.ceil(this.numItems() / this.itemsPerPage);
			} else {
				return 1;
			}
		},

		//
		// setting methods
		//

		setPage: function(pageNumber) {
			if (pageNumber == undefined) {
				pageNumber = 1;
			}
			this.pageNumber = pageNumber;
			this.showList();
			this.showNavButtonBar();
		},

		//
		// selection methods
		//

		selectAll: function() {
			this.groupSelected = true;
			this.selectRange(0, this.collection.length - 1);
		},

		deselectAll: function() {
			this.groupSelected = false;
			this.deselectRange(0, this.collection.length - 1);
		},

		selectRange: function(from, to) {
			if (from > to) {
				var temp = from;
				from = to;
				to = temp;
			}

			for (var i = from; i <= to; i++) {
				this.collection.at(i).selected = true;
			}
			this.showList();
		},

		deselectRange: function(from, to) {
			if (from > to) {
				var temp = from;
				from = to;
				to = temp;
			}

			for (var i = from; i <= to; i++) {
				this.collection.at(i).selected = false;
			}
			this.showList();
		},

		setSelectedRange: function(from, to, selected) {
			if (from > to) {
				var temp = from;
				from = to;
				to = temp;
			}

			if (selected) {
				this.selectRange(from, to);
			} else {
				this.deselectRange(from, to);
			}
		},

		//
		// methods
		//

		batchSendEmails: function(subject, body) {
			var self = this;
			var count = 0;
			var users = this.getWhiteList();
			var batches = users.length / this.batchSize;
			var sent = 0;
			var failures = [];

			function nextBatch() {
				var batch = [];
				while (count < users.length && batch.length < self.batchSize) {
					batch.push(users[count]);
					count++;			
				}
				return batch;
			}

			function sendBatch(batch) {
				var emails = new Users(batch).pluck('email');

				self.request = new Users().sendEmail(subject, body, {
					include: emails,

					// callbacks
					//
					success: function(response) {
						var progress = Math.round(count / users.length * 100);

						// add success and failures
						//
						if (response.sent) {
							sent += response.sent;
						}
						if (response.failures) {
							for (var i = 0; i < response.failures.length; i++) {
								failures.push(response.failures[i]);
							}
						}

						// update progress bar
						//
						if (self.progressBar) {
							self.progressBar.setMessage('Sent ' + count + ' / ' + users.length);
							self.progressBar.setAmount(progress + '%');
							self.progressBar.setPercent(progress);

							// check if done
							//
							if (count < users.length) {

								// send next batch
								//
								sendBatch(nextBatch());
							} else {

								// close progress bar
								//
								self.progressBar.hide();

								// show message dialog
								//
								showMailStatus(sent, failures);
							}
						}
					},

					error: function() {
						if (self.request.statusText == 'abort') {
							application.notify({
								message: "Aborted system emails. Sent " + count + " out of " + users.length + "."
							});
						} else {
							application.error({
								message: "Could not send all system emails. Sent " + count + " out of " + users.length + "."
							});
						}
					}
				});
			}

			function showMailStatus(sent, failures) {
				var message = '';

				// add count of successful emails
				//
				if (sent > 0) {
					message = "Sent " + sent + " emails successfully. ";
				}

				// add failed emails
				//
				if (failures.length > 0) {
					message += "Failed sending the following " + failures.length + " emails:<br/><br/>";
					message += '<textarea rows="12" style="width:100%;margin-top:10px">' + JSON.stringify(failures) + '</textarea>';
				}

				application.notify({
					message: message
				});
			}

			this.progressBar = new ProgressDialogView({
				title: "Sending System Emails",
				cancelable: true,

				// callbacks
				//
				cancel: function() {
					self.progressBar.hide();
					self.progressBar = null;
					self.request.abort();
				}
			});

			// show progress bar
			//
			application.show(this.progressBar);

			// send first batch
			//
			sendBatch(nextBatch());
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				showInactiveAccounts: this.options.showInactiveAccounts
			};
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// show child views
			//
			this.fetchAndShowList();
			this.showEmailForm();
		},

		fetchAndShowList: function() {
			var self = this;
			this.collection.fetchEmail({
				data: {
					show_inactive: this.options.showInactiveAccounts
				},

				// callbacks
				//
				success: function(collection) {

					// initialize selected array
					//
					for (var i = 0; i < collection.length; i++) {
						collection.at(i).selected = false;
					}

					// update
					//
					self.showList();
					self.showNavButtonBar();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch system users."
					});
				}
			});
		},

		showList: function() {
			var self = this;
			var from = ((this.pageNumber - 1) * this.itemsPerPage);
			var to = Math.min(from + this.itemsPerPage, this.collection.length) - 1;

			// preserve existing sorting column and order
			//
			if (this.hasChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			// show system email list view
			//
			this.showChildView('list', new SystemEmailListView({
				start: from,
				collection: new Users(this.getItems(from, to)),
				groupSelected: this.groupSelected,
				parent: this,

				// options
				//
				sortBy: this.options.sortBy,
				showHibernate: this.options.showInactiveAccounts,

				// callbacks
				//
				onClick: function(index) {
					self.collection.at(index).selected = !self.collection.at(index).selected;
				}
			}));
		},

		showNavButtonBar: function() {
			this.showChildView('nav', new NavButtonBarView({
				itemsPerPage: this.itemsPerPage,
				maxItemsPerPage: this.constructor.maxItemsPerPage,
				pageNumber: this.pageNumber,
				numPages: this.numPages(),
				parent: this
			}));
		},

		showEmailForm: function() {
			this.showChildView('form', new SystemEmailFormView());
		},

		animateProgressBar: function() {
			var self = this;

			var progress = 0;
			var progressBar = new ProgressDialogView({
				title: "Sending System Emails",
				cancelable: true,

				// callbacks
				//
				cancel: function() {
					progressBar.close();
					window.clearInterval(interval);
				}
			});

			// show progress bar
			//
			application.show(progressBar);

			// animate progress bar
			//
			var interval = window.setInterval(function() {
				progress += 10;
				progressBar.setAmount(progress + '%');
				progressBar.setPercent(progress);
				if (progress == 100) {
					window.clearInterval(interval);
					progressBar.hide();
				}
			}, 1000);
		},

		//
		// event handling methods
		//

		onClickShowInactiveAccounts: function(event) {
			this.options.showInactiveAccounts = $(event.target).is(':checked');
			this.fetchAndShowList();
		},

		onClickSendEmail: function() {
			// this.animateProgressBar();

			// get form values
			//
			var subject = this.getChildView('form').getValue('subject');
			var body = this.getChildView('form').getValue('body');

			// send emails
			//
			this.batchSendEmails(subject, body);
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		}
	}, {

		//
		// static attributes
		//

		maxItemsPerPage: 1000
	});
});
