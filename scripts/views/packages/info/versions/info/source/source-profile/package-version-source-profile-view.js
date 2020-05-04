/******************************************************************************\ 
|                                                                              |
|                      package-version-source-profile-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a package version's source          |
|        information.                                                          |
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
	'text!templates/packages/info/versions/info/source/source-profile/package-version-source-profile.tpl',
	'utilities/scripting/file-utils',
	'models/files/file',
	'models/files/directory',
	'views/base-view',
	'views/files/directory-tree/directory-tree-view',
	'views/packages/info/versions/directory-tree/package-version-directory-tree-view'
], function($, _, Template, FileUtils, File, Directory, BaseView, DirectoryTreeView, PackageVersionDirectoryTreeView) {
	return BaseView.extend({

		//
		// attributes
		//
		incremental: true,

		template: _.template(Template),

		regions: {
			contents: '#contents'
		},

		events: {
			'click #edit-source-info': 'onClickEditSourceInfo',
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				isAtomic: this.model.isAtomic(),
				isOwned: this.options.package.isOwned(),
				hasLanguageVersion: this.options.package.hasLanguageVersion()
			};
		},

		onRender: function() {
			this.fetchAndShowContents();
		},

		fetchAndShowContents: function() {
			var self = this;

			// fetch package version directory tree
			//
			this.model.fetchFileTree({
				data: {
					'dirname': self.incremental? '.' : null
				},

				// callbacks
				//
				success: function(data) {
					self.showContents(data);
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

		showContents: function(data) {
			if (this.incremental) {

				// show incremental directory tree
				//
				if (_.isArray(data)) {

					// top level is a directory listing
					//
					this.showChildView('contents', new PackageVersionDirectoryTreeView({
						model: new Directory({
							contents: data
						}),
						packageVersion: this.model
					}));
				} else if (isDirectoryName(data.name)) {

					// top level is a directory
					//
					this.showChildView('contents', new PackageVersionDirectoryTreeView({
						model: new Directory({
							name: data.name,
						}),
						packageVersion: this.model
					}));		
				} else {

					// top level is a file
					//
					this.showChildView('contents', new PackageVersionDirectoryTreeView({
						model: new Directory({
							contents: new File({
								name: data.name
							})
						}),
						packageVersion: this.model
					}));	
				}
			} else {

				// show complete directory tree
				//
				if (_.isArray(data)) {

					// top level is a directory listing
					//
					this.showChildView('contents', new DirectoryTreeView({
						model: new Directory({
							contents: data
						}),
						packageVersion: this.model
					}));
				} else if (isDirectoryName(data.name)) {

					// top level is a directory
					//
					this.showChildView('contents', new DirectoryTreeView({
						model: new Directory({
							name: data.name
						}),
						packageVersion: this.model
					}));
				} else {

					// top level is a file
					//
					this.showChildView('content', new DirectoryTreeView({
						model: new Directory({
							contents: new File({
								name: data.name
							})
						}),
						packageVersion: this.model
					}));		
				}
			}
		},

		//
		// event handling methods
		//

		onClickEditSourceInfo: function() {

			// go to edit package version view
			//
			application.navigate('#packages/versions/' + this.model.get('package_version_uuid') + '/source/edit');
		},
	});
});
