/******************************************************************************\
|                                                                              |
|                          restricted-domains-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing restricted domains.                   |
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
	'text!templates/admin/settings/restricted-domains/restricted-domains.tpl',
	'models/admin/restricted-domain',
	'collections/admin/restricted-domains',
	'views/base-view',
	'views/admin/settings/restricted-domains/restricted-domains-list/restricted-domains-list-view'
], function($, _, Template, RestrictedDomain, RestrictedDomains, BaseView, RestrictedDomainsListView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#restricted-domains-list'
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
		// constructor
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

					// show error message
					//
					application.error({
						message: "Could not fetch restricted domains."
					});
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
					application.notify({
						title: "Restricted Domain Changes Saved",
						message: "Your restricted domain changes have been successfully saved."
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Your restricted domain changes could not be saved."
					});
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
				self.showChildView('list', new RestrictedDomainsListView({
					collection: self.collection,
					showDelete: true
				}));
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
			this.getChildView('list').render();
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
			application.navigate('#home');
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
