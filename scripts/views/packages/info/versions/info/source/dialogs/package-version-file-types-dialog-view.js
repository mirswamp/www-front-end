/******************************************************************************\
|                                                                              |
|                    package-version-file-types-dialog-view.js                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that is used to select directories          |
|        within package versions.                                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/packages/info/versions/info/source/dialogs/package-version-file-types-dialog.tpl',
	'views/dialogs/dialog-view',
	'views/files/file-types-list/file-types-list-view'
], function($, _, Template, DialogView, FileTypesListView) {
	return DialogView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			file_types: '#file-types'
		},

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: this.options.title,
				packagePath: this.options.packagePath
			};
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

					// show child views
					//
					self.showChildView('file_types', new FileTypesListView({
						collection: collection
					}));
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch file types for this package version."
					});
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
