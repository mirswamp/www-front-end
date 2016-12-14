/******************************************************************************\
|                                                                              |
|                       add-new-package-dependency-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a modal dialog box for adding new package                |
|        dependencies.                                                         |
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
	'validate',
	'popover',
	'text!templates/packages/info/versions/info/build/dependencies/editable-list/dialogs/add-new-package-dependency.tpl',
	'models/packages/package-version-dependency',
	'views/dialogs/error-view',
	'views/packages/info/versions/info/build/dependencies/editable-list/forms/package-dependency-form-view',
], function($, _, Backbone, Marionette, Validate, Popover, Template, PackageVersionDependency, ErrorView, PackageDependencyFormView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			packageDependencyForm: '#package-dependency-form',
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #ok': 'onClickOk'
		},

		//
		// methods
		//

		initialize: function() {
			var self = this;

			// create new model
			//
			this.model = new PackageVersionDependency({
				package_version_uuid: this.options.packageVersion.get('package_version_uuid')
			});
		},

		//
		// rendering methods
		//

		onRender: function() {
			var self = this;
			var excludePlatformVersionUuids = this.collection.getPlatformVersionsUuids();

			// show subviews
			//
			this.packageDependencyForm.show(
				new PackageDependencyFormView({
					model: this.model,

					// callbacks
					//
					onChange: function() {
						self.enableButtons();
					}
				})
			);
		},

		showWarning: function() {
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// button enabling / disabling methods
		//

		enableButtons: function() {
			this.$el.find('#ok').removeAttr('disabled');
		},

		disableButtons: function() {
			this.$el.find('#ok').attr('disabled','disabled');
		},

		//
		// event handling methods
		//

		onClickAlertClose: function() {
			this.hideWarning();
		},

		onClickOk: function() {
			if (this.packageDependencyForm.currentView.isValid()) {

				// update model
				//
				this.packageDependencyForm.currentView.update(this.model);

				// check for existing dependency
				//
				var dependencies = this.collection.getByPlatformUuid(
					this.model.get('platform_version_uuid')
				);
				if (dependencies.length > 0) {
					var dependency = dependencies.at(0);

					// add dependency list to model
					//
					dependency.set({
						dependency_list: dependency.get('dependency_list') + ' ' + this.model.get('dependency_list')
					});

					// perform callback
					//
					if (this.options.onAdd) {
						return this.options.onAdd();
					}
				} else {

					// add model to collection
					//
					this.collection.add(this.model);

					// perform callback
					//
					if (this.options.onAdd) {
						return this.options.onAdd();
					}
				}
			} else {
				this.showWarning();
				return false;
			}
		}
	});
});
