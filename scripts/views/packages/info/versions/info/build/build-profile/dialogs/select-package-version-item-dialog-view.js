/******************************************************************************\
|                                                                              |
|                  select-package-version-item-dialog-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box that is used to select items within         |
|        package versions.                                                     |
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
	'text!templates/packages/info/versions/info/build/build-profile/dialogs/select-package-version-item-dialog.tpl',
	'utilities/scripting/file-utils',
	'models/files/file',
	'models/files/directory',
	'views/dialogs/dialog-view',
	'views/packages/info/versions/directory-tree/package-version-directory-tree-view'
], function($, _, Template, FileUtils, File, Directory, DialogView, PackageVersionDirectoryTreeView) {
	return DialogView.extend({

		//
		// attributes
		//
		
		incremental: true,

		template: _.template(Template),

		regions: {
			contents: '#contents'
		},

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// constructor
		//

		initialize: function() {

			// select only directories, not files
			//
			this.selectable = {
				files: true,
				directories: true
			};
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				title: this.options.title,
				message: this.options.message
			};
		},

		showContents: function(data) {
			this.showChildView('contents', new PackageVersionDirectoryTreeView({
				model: new Directory({
					name: data.name,
					contents: data.contents
				}),
				packageVersion: this.model,
				selectable: this.selectable
			}));
		},

		showAllContents: function(data) {
			this.showChildView('content', new DirectoryTreeView({
				model: new Directory({
					name: data.name,
					contents: data.contents
				}),
				packageVersion: this.model,
				selectable: this.selectable
			}));
		},

		fetchAndShowContents: function(dirname) {
			var self = this;
			this.model.fetchFileList({
				data: {
					'dirname': dirname
				},

				// callbacks
				//
				success: function(data) {
					self.showContents({
						name: dirname,
						contents: data
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get a file list for this package version."
					});
				}
			});
		},

		fetchAndShowAllContents: function(dirname) {
			this.model.fetchFileTree({
				data: {
					'dirname': null
				},

				// callbacks
				//
				success: function(data) {
					self.showAllContents({
						name: dirname,
						contents: data
					});
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not get a file tree for this package version."
					});
				}
			});
		},

		onRender: function() {
			var self = this;

			// get root name
			//
			this.model.fetchRoot({

				// callbacks
				//
				success: function(root) {

					// fetch and show package version root contents
					//
					if (self.incremental) {
						self.fetchAndShowContents(root);
					} else {
						self.fetchAndShowAllContents(root);
					}
				}
			});
		},

		//
		// event handling methods
		//

		onClickOk: function() {

			// get selected element
			//
			var selectedItemName = this.$el.find('.selected .name').html();

			// apply callback
			//
			if (this.options.accept) {
				this.options.accept(selectedItemName);
			}
		}
	});
});
