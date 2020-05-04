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
	'views/admin/settings/system-email/system-email-list/system-email-list-view'
], function($, _, Popover, Template, User, Users, BaseView, SystemEmailListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#system-email-list'
		},

		events: {
			'click #show-inactive-accounts': 'onClickShowInactiveAccounts',
			'click #send-email': 'onClickSendEmail',
			'click #select-all': 'onClickSelectAll',
			'click tbody td input': 'onClickSelectRow',
			'click #show-numbering': 'onClickShowNumbering'
		},

		//
		// constructor
		//

		initialize: function() {

			// set optional parameter defaults
			//
			if (this.options.showInactiveAccounts == undefined) {
				this.options.showInactiveAccounts = true;
			}
			if (this.options.showNumbering == undefined) {
				this.options.showNumbering = application.options.showNumbering;
			}

			// set attributes
			//
			this.collection = new Users();
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
			var self = this;

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// fetch and show system email users
			//
			this.collection.fetchAll({

				// callbacks
				//
				success: function(collection) {
					self.showList();
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

			// preserve existing sorting column and order
			//
			if (this.hasChildView('list') && this.collection.length > 0) {
				this.options.sortBy = this.getChildView('list').getSorting();
			}

			// show system email list view
			//
			this.showChildView('list', new SystemEmailListView({
				collection: new Users(this.collection.filter(function(user) {
					return user.isEnabled() && (self.options.showInactiveAccounts || user.isActive());
				})),

				// options
				//
				sortBy: this.options.sortBy,
				showHibernate: this.options.showInactiveAccounts
			}));
		},

		//
		// event handling methods
		//

		onClickShowInactiveAccounts: function(event) {
			this.options.showInactiveAccounts = $(event.target).is(':checked');
			this.showList();
		},

		onClickSendEmail: function() {
			var recipients = [];
			$('tbody input:checked').each( function(){
				recipients.push({ email: $(this).val() });
			});
			recipients = new Users( recipients );

			var subject = $('#email-subject').first().val();
			var body = $('#email-body').first().val();
			recipients.sendEmail(subject, body, {

				// callbacks
				//
				success: function(response) {
					var message = "System email sent successfully. ";

					// add failed emails
					//
					if (response.responseText) {
						message += "Failed sending for the following users:<br/><br/>";
						message += '<textarea rows="12">' + JSON.stringify(response) + '</textarea>';
					}

					application.notify({
						message: message
					});
				},
				error: function(response) {
					application.error({
						message: response.responseText
					});
				}
			});

		},

		onClickSelectAll: function(event) {
			$('tbody td input').prop('checked', event.target.checked);
		},

		onClickSelectRow: function() {
			$('#select-all').prop('checked', false);
		},

		onClickShowNumbering: function(event) {
			application.setShowNumbering($(event.target).is(':checked'));
		}
	});
});
