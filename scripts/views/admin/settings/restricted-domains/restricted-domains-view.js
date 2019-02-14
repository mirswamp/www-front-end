/******************************************************************************\
|                                                                              |
|                               settings-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing the system settings.                  |
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
	'marionette',
	'text!templates/admin/settings/restricted-domains/restricted-domains.tpl',
	'registry',
	'models/admin/restricted-domain',
	'collections/admin/restricted-domains',
	'views/dialogs/error-view',
	'views/dialogs/notify-view',
	'views/admin/settings/restricted-domains/restricted-domains-list/restricted-domains-list-view'
], function($, _, Backbone, Marionette, Template, Registry, RestrictedDomain, RestrictedDomains, ErrorView, NotifyView, RestrictedDomainsListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			restrictedDomainsList: '#restricted-domains-list'
		},

		events: {
			'click #add': 'onClickAdd',
			'click #save': 'onClickSave',
			'click #cancel': 'onClickCancel',
			'keyup .name': 'onNameKeyup',
			'input input': 'onChangeInput',
			'keyup input': 'onChangeInput',
		},

		//
		// methods
		//

		initialize: function() {
			this.collection = new RestrictedDomains();
		},

		//
		// ajax methods
		//

		fetchRestrictedDomains: function(done) {
			this.collection.fetch({

				// callbacks
				//
				success: function() {
					done();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch restricted domains."
						})
					);
				}
			});
		},

		saveRestrictedDomains: function() {
			this.collection.save({

				// callbacks
				//
				success: function() {

					// show success notification dialog
					//
					Registry.application.modal.show(
						new NotifyView({
							title: "Restricted Domain Changes Saved",
							message: "Your restricted domain changes have been successfully saved."
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Your restricted domain changes could not be saved."
						})
					);
				}
			});
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;

			// fetch and show restricted domains
			//
			this.fetchRestrictedDomains(function() {
				self.restrictedDomainsList.show(
					new RestrictedDomainsListView({
						collection: self.collection,
						showDelete: true
					})
				);
			});
		},

		//
		// event handling methods
		//

		onClickAdd: function() {
			this.collection.add(new RestrictedDomain({}));

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);	
			
			// update list view
			//
			this.restrictedDomainsList.currentView.render();
		},
		
		onClickSave: function() {

			// disable save button
			//
			this.$el.find('#save').prop('disabled', true);

			// perform save
			//
			this.saveRestrictedDomains();
		},

		onClickCancel: function() {
			Backbone.history.navigate('#home', {
				trigger: true
			});
		},

		onNameKeyup: function(event) {
			var match = false;
			$('.name').each(function() {
				if (this.value !== event.currentTarget.value) {
					$(this).parent().removeClass('control-group error');
				}
				if ((event.currentTarget !== this) && (this.value === event.currentTarget.value)) {
					match = true;
					return false;
				}
			});
			if (match) {
				$(event.currentTarget).parent().addClass('control-group error');
				$('#save').attr('disabled','disabled');
			} else {
				$(event.currentTarget).parent().removeClass('control-group error');
				$('#save').removeAttr('disabled');
			}
		},

		onChangeInput: function() {

			// enable save button
			//
			this.$el.find('#save').prop('disabled', false);	
		}
	});
});
