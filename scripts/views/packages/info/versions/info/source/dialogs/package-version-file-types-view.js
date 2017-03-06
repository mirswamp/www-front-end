/******************************************************************************\
|                                                                              |
|                          package-version-file-types-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog that is used to select directories within      |
|        package versions.                                                     |
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
	'text!templates/packages/info/versions/info/source/dialogs/package-version-file-types.tpl',
	'registry',
	'views/dialogs/error-view',
	'views/files/file-types-list/file-types-list-view'
], function($, _, Backbone, Marionette, Template, Registry, ErrorView, FileTypesListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			fileTypes: '#file-types'
		},

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				title: this.options.title,
				packagePath: this.options.packagePath
			});
		},

		onRender: function() {
			this.showFileTypes();
		},

		showFileTypes: function() {

			// fetch package version file types
			//
			var self = this;
			this.model.fetchFileTypes({
				data: {
					'dirname': this.options.packagePath
				},
				
				// callbacks
				//
				success: function(data) {
					var collection = new Backbone.Collection();
					var keys = Object.keys(data);

					if (keys.length > 0) {
						for (var key in data) {
							collection.add(new Backbone.Model({
								'extension': key,
								'count': data[key]
							}));
						}
					}

					self.fileTypes.show(
						new FileTypesListView({
							collection: collection
						})
					);
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch file types for this package version."
						})
					);	
				}
			});
		},

		//
		// event handling methods
		//

		onClickOk: function() {

			// apply callback
			//
			if (this.options.accept) {
				this.options.accept();
			}
		}
	});
});
