/******************************************************************************\
|                                                                              |
|                   add-new-package-dependency-dialog-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box for adding new package dependencies.        |
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
	'text!templates/packages/info/versions/info/build/dependencies/editable-list/dialogs/add-new-package-dependency-dialog.tpl',
	'models/packages/package-version-dependency',
	'views/dialogs/dialog-view',
	'views/packages/info/versions/info/build/dependencies/editable-list/forms/package-dependency-form-view',
], function($, _, Template, PackageVersionDependency, DialogView, PackageDependencyFormView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#package-dependency-form',
		},

		events: {
			'click .alert .close': 'onClickAlertClose',
			'click #ok': 'onClickOk'
		},

		//
		// constructor
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
			this.showChildView('form', new PackageDependencyFormView({
				model: this.model,

				// callbacks
				//
				onChange: function(isValid) {
					if (isValid) {
						self.enableButtons();
					} else {
						self.disableButtons();
					}
				}
			}));
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
			if (this.getChildView('form').isValid()) {

				// update model
				//
				this.getChildView('form').applyTo(this.model);

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
