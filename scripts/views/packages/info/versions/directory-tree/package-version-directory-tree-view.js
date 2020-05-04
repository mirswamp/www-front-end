/******************************************************************************\
|                                                                              |
|                       package-version-directory-tree-view.js                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view that shows a directory tree.                      |
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
	'text!templates/files/directory-tree/directory-tree.tpl',
	'models/files/file',
	'models/files/directory',
	'models/packages/package-version',
	'views/files/directory-tree/directory-tree-view',
	'views/packages/info/versions/directory-tree/package-version-file-view'
], function($, _, Template, File, Directory, PackageVersion, DirectoryTreeView, PackageVersionFileView) {
	return DirectoryTreeView.extend({

		//
		// ajax methods
		//

		fetchContents: function(options) {
			var self = this;

			// fetch package version directory listing
			//
			this.options.packageVersion.fetchFileList({
				data: {
					dirname: this.model.get('name')
				},

				// callbacks
				//
				success: function(data) {

					// perform callback
					//
					if (options && options.success) {
						options.success(data);
					}
				},

				error: function(data) {

					// perform callback
					//
					if (options && options.error) {
						options.error(data);
					}
				}
			});
		},

		//
		// rendering methods
		//

		getChildView: function(item) {
			if (item instanceof File) {
				return new PackageVersionFileView({
					model: item,
					selectable: this.options.selectable,
					selected: this.isFileSelected(item)
				});
			} else if (item instanceof Directory) {
				return new this.constructor(_.extend(this.options, {
					model: item,
					parent: this,
					selectable: this.options.selectable,
					selectedDirectoryName: this.options.selectedDirectoryName,
					selectedFileName: this.options.selectedFileName,			
					packageVersion: this.options.packageVersion
				}));
			}
		},

		showContents: function() {
			var self = this;

			// switch folder icon
			//
			this.$el.find('> .directory > i').removeClass('fa-folder');
			this.$el.find('> .directory > i').addClass('fa-folder-open');

			if (this.model.has('contents')) {

				// show contents
				//
				this.$el.find('.contents').show();
			} else {

				// get root name
				//
				if (!this.model.has('name')) {
					this.model.fetchRoot({
						success: function(data) {

							// set name of root directory
							//
							self.model.set({
								name: data
							});

							self.fetchContents({

								// callbacks
								//
								success: function(data) {
									self.model.setContents(data);
									self.onRender();
								}
							});
						}
					});
				} else {
					this.fetchContents({

						// callbacks
						//
						success: function(data) {
							self.model.setContents(data);
							self.onRender();
						}
					});
				}
			}
		}
	});
});