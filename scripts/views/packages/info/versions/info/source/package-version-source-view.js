
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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/info/versions/info/source/package-version-source.tpl',
	'registry',
	'views/packages/info/versions/info/source/source-profile/package-version-source-profile-view'
], function($, _, Backbone, Marionette, Template, Registry, PackageVersionSourceProfileView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//
		incremental: true,

		regions: {
			packageVersionSourceProfile: '#package-version-source-profile'
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

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model,
				package: this.options.package,
				showNavigation: this.options.showNavigation
			}));
		},

		onRender: function() {

			// show profile
			//
			this.packageVersionSourceProfile.show(
				new PackageVersionSourceProfileView({
					model: this.model,
					package: this.options.package
				})
			);
		},

		//
		// event handling methods
		//

		onClickShowFileTypes: function() {
			var self = this;
			require([
				'views/packages/info/versions/info/source/dialogs/package-version-file-types-view'
			], function (PackageVersionFileTypesView) {

				// show package version file types dialog
				//
				Registry.application.modal.show(
					new PackageVersionFileTypesView({
						model: self.model,
						packagePath: self.model.get('source_path')
					})
				);
			});
		},

		onClickShowGemInfo: function(event) {
			var self = this;
			require([
				'views/packages/info/versions/info/source/dialogs/package-version-gem-info-view'
			], function (PackageVersionGemInfoView) {

				// show package version gem info dialog
				//
				Registry.application.modal.show(
					new PackageVersionGemInfoView({
						model: self.model,
						packagePath: self.model.get('source_path')
					}), {
						size: 'large'
					}
				);
			});
		},

		onClickShowWheelInfo: function(event) {
			var self = this;
			require([
				'views/packages/info/versions/info/source/dialogs/package-version-wheel-info-view'
			], function (PackageVersionWheelInfoView) {
				var path = self.model.get('source_path');
				var dirname = self.model.getWheelDirname();

				// strip off trailing slash of path
				//
				if (path.endsWith('/')) {
					path = path.substring(0, path.length - 1);
				}

				// show package version wheel info dialog
				//
				Registry.application.modal.show(
					new PackageVersionWheelInfoView({
						model: self.model,
						dirname: path + "/" + dirname
					})
				);
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
