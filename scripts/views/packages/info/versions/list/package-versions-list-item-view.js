/******************************************************************************\
|                                                                              |
|                          package-versions-list-item-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single package list item.           |
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
	'text!templates/packages/info/versions/list/package-versions-list-item.tpl',
	'registry',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
], function($, _, Backbone, Marionette, Template, Registry, ConfirmView, NotifyView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click button.delete': 'onClickDelete'
		},

		//
		// methods
		//

		deleteVersion: function() {
			var self = this;

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete Package Version",
					message: "Are you sure that you want to delete version " + this.model.get('version_string') + " of " + this.options.package.get('name') + "? " + 
						"Any scheduled assessments using this package version will be deleted. Existing assessment results will not be deleted.",

					// callbacks
					//
					accept: function() {
						self.model.destroy({
							
							// callbacks
							//
							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this package version."
									})
								);
							}
						});
					}
				})
			);
		},

		deletePackage: function() {
			var self = this;
			
			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete Package",
					message: "Deleting the last version will result in deleting the package. Any scheduled assessments using this package version will be deleted. Existing assessment results will not be deleted. Are you sure that you want to delete package " + this.options.package.get('name') + "?",

					// callbacks
					//
					accept: function() {
						self.options.package.destroy({
							
							// callbacks
							//
							success: function() {

								// go to packages view
								//
								Backbone.history.navigate('#packages', {
									trigger: true
								});
							},

							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this package version."
									})
								);
							}
						});
					}
				})
			);
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				url: Registry.application.session.user? Registry.application.getURL() + '#packages/versions/' + this.model.get('package_version_uuid') : undefined,
				showDelete: this.options.package.isOwned()
			}));
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			if (this.options.collection.length > 1) {
				this.deleteVersion();
			} else {
				this.deletePackage();
			}
		}
	});
});