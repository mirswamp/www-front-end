/******************************************************************************\
|                                                                              |
|                       restricted-domains-list-item-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing the domains that are restricted       |
|        for use for user verification.                                        |
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
	'text!templates/admin/settings/restricted-domains/restricted-domains-list/restricted-domains-list-item.tpl',
	'registry',
	'models/admin/restricted-domain',
	'views/dialogs/error-view',
	'views/dialogs/confirm-view'
], function($, _, Backbone, Marionette, Template, Registry, RestrictedDomain, ErrorView, ConfirmView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click button.delete': 'onClickDelete',
			'blur .domain-name': 'onBlurDomainName',
			'blur .description': 'onBlurDescription'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				showDelete: this.options.showDelete
			}));
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;
			var message;

			if (this.model.has('domain_name')) {
				message = "Are you sure you want to delete the domain '" + this.model.get('domain_name') + "'?";
			} else {
				message = "Are you sure you want to delete this domain?";
			}

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete Restricted Domain",
					message: message,

					// callbacks
					//
					accept: function() {
						self.model.destroy({

							// callbacks
							//
							success: function() {
								self.render();
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete restricted domain."
									})
								);
							}
						});
					}
				})
			);
		},

		onBlurDomainName: function(event) {
			var domainName = $(event.target).val();
			if (domainName === '') {
				domainName = undefined;
			}
			this.model.set({
				'domain_name': domainName
			});
		},

		onBlurDescription: function(event) {
			var description = $(event.target).val();
			if (description === '') {
				description = undefined;
			}
			this.model.set({
				'description': description
			});
		}
	});
});
