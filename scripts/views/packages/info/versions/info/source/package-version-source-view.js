
/******************************************************************************\ 
|                                                                              |
|                           package-version-source-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package version's source code.    |
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
	'text!templates/packages/info/versions/info/source/package-version-source.tpl',
	'views/base-view',
	'views/packages/info/versions/info/source/source-profile/package-version-source-profile-view'
], function($, _, Template, BaseView, PackageVersionSourceProfileView) {
	return BaseView.extend({

		//
		// attributes
		//
		incremental: true,

		template: _.template(Template),

		regions: {
			profile: '#package-version-source-profile'
		},

		events: {
			'click #show-file-types': 'onClickShowFileTypes',
			'click #show-gem-info': 'onClickShowGemInfo',
			'click #show-wheel-info': 'onClickShowWheelInfo',
			'click #cancel': 'onClickCancel',
			'click #prev': 'onClickPrev',
			'click #next': 'onClickNext'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				package: this.options.package,
				showNavigation: this.options.showNavigation
			};
		},

		onRender: function() {

			// show profile
			//
			this.showChildView('profile', new PackageVersionSourceProfileView({
				model: this.model,
				package: this.options.package
			}));
		},

		//
		// event handling methods
		//

		onClickShowFileTypes: function() {
			var self = this;
			require([
				'views/packages/info/versions/info/source/dialogs/package-version-file-types-dialog-view'
			], function (PackageVersionFileTypesDialogView) {

				// show package version file types dialog
				//
				application.show(new PackageVersionFileTypesDialogView({
					model: self.model,
					packagePath: self.model.get('source_path')
				}));
			});
		},

		onClickShowGemInfo: function(event) {
			var self = this;
			require([
				'views/packages/info/versions/info/source/dialogs/package-version-gem-info-dialog-view'
			], function (PackageVersionGemInfoDialogView) {

				// show package version gem info dialog
				//
				application.show(new PackageVersionGemInfoView({
					model: self.model,
					packagePath: self.model.get('source_path')
				}), {
					size: 'large'
				});
			});
		},

		onClickShowWheelInfo: function(event) {
			var self = this;
			require([
				'views/packages/info/versions/info/source/dialogs/package-version-wheel-info-dialog-view'
			], function (PackageVersionWheelInfoDialogView) {
				var path = self.model.get('source_path');
				var dirname = self.model.getWheelDirname();

				// strip off trailing slash of path
				//
				if (path.endsWith('/')) {
					path = path.substring(0, path.length - 1);
				}

				// show package version wheel info dialog
				//
				application.show(new PackageVersionWheelInfoDialogView({
					model: self.model,
					dirname: path + "/" + dirname
				}));
			});
		},

		onClickPrev: function() {

			// go to package version view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid'), {
				trigger: true
			});
		},

		onClickNext: function() {

			// go to package version build view
			//
			Backbone.history.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/build', {
				trigger: true
			});
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
