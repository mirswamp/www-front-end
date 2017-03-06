/******************************************************************************\
|                                                                              |
|                        new-package-version-source-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for setting a package versions's source         |
|        information.                                                          |
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
	'tooltip',
	'popover',
	'text!templates/packages/info/versions/info/source/new-package-version-source.tpl',
	'registry',
	'views/packages/info/versions/info/source/source-profile/package-version-source-profile-form-view',
	'views/packages/info/versions/info/source/dialogs/package-version-file-types-view'
], function($, _, Backbone, Marionette, Tooltip, Popover, Template, Registry, PackageVersionSourceProfileFormView, PackageVersionFileTypesView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			packageVersionSourceProfileForm: '#package-version-source-profile-form'
		},

		events: {
			'click #next': 'onClickNext',
			'click #prev': 'onClickPrev',
			'click #show-file-types': 'onClickShowFileTypes',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				package: this.options.package
			}));
		},

		onRender: function() {

			// show profile
			//
			this.packageVersionSourceProfileForm.show(
				new PackageVersionSourceProfileFormView({
					model: this.model,
					package: this.options.package,
					parent: this
				})
			);
		},

		//
		// event handling methods
		//

		onClickNext: function() {

			// check validation
			//
			if (this.packageVersionSourceProfileForm.currentView.isValid()) {

				// update model
				//
				this.packageVersionSourceProfileForm.currentView.update(this.model);
				
				// show next view
				//
				this.options.parent.showBuild();
			}
		},

		onClickPrev: function() {

			// show next prev view
			//
			this.options.parent.showDetails();
		},
		
		onClickShowFileTypes: function(event) {

			// show package version file types dialog
			//
			Registry.application.modal.show(
				new PackageVersionFileTypesView({
					model: this.model,
					packagePath: this.$el.find('#package-path').val()
				})
			);

			// prevent event defaults
			//
			event.stopPropagation();
			event.preventDefault();
		},

		onClickCancel: function() {

			// go to package view
			//
			Backbone.history.navigate('#packages/' + this.options.package.get('package_uuid'), {
				trigger: true
			});
		}
	});
});