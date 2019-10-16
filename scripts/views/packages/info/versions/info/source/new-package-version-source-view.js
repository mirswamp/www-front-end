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
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/versions/info/source/new-package-version-source.tpl',
	'views/base-view',
	'views/packages/info/versions/info/source/source-profile/package-version-source-profile-form-view',
	'views/packages/info/versions/info/source/dialogs/package-version-file-types-dialog-view'
], function($, _, Template, BaseView, PackageVersionSourceProfileFormView, PackageVersionFileTypesDialogView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#package-version-source-profile-form'
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

		templateContext: function() {
			return {
				model: this.model,
				package: this.options.package
			};
		},

		onRender: function() {

			// show profile
			//
			this.showChildView('form', new PackageVersionSourceProfileFormView({
				model: this.model,
				package: this.options.package,
				parent: this
			}));
		},

		//
		// event handling methods
		//

		onClickNext: function() {

			// check validation
			//
			if (this.getChildView('form').isValid()) {

				// update model
				//
				this.getChildView('form').applyTo(this.model);
				
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
			application.show(new PackageVersionFileTypesDialogView({
				model: this.model,
				packagePath: this.$el.find('#package-path').val()
			}));

			// prevent further handling of event
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