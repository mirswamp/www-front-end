/******************************************************************************\
|                                                                              |
|                        select-package-version-file-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog that is used to select files within            |
|        package versions.                                                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/info/versions/info/build/build-profile/dialogs/select-package-version-file.tpl',
	'registry',
	'utilities/file-utils',
	'models/files/file',
	'models/files/directory',
	'views/dialogs/error-view',
	'views/packages/info/versions/directory-tree/package-version-directory-tree-view'
], function($, _, Backbone, Marionette, Template, Registry, FileUtils, File, Directory, ErrorView, PackageVersionDirectoryTreeView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//
		
		incremental: true,

		regions: {
			contents: '#contents'
		},

		events: {
			'click #ok': 'onClickOk',
			'keypress': 'onKeyPress'
		},

		//
		// methods
		//

		initialize: function() {

			// select only directories, not files
			//
			this.selectable = {
				files: true,
				directories: false
			}
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				title: this.options.title,
				message: this.options.message
			});
		},

		onRender: function() {
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
					if (self.incremental) {

						// show incremental directory tree
						//
						if (_.isArray(data)) {

							// top level is a directory listing
							//
							self.contents.show(
								new PackageVersionDirectoryTreeView({
									model: new Directory({
										contents: data
									}),
									packageVersion: self.model,
									selectable: self.selectable,
									selectedFileName: self.options.selectedFileName
								})
							);
						} else if (isDirectoryName(data.name)) {

							// top level is a directory
							//
							self.contents.show(
								new PackageVersionDirectoryTreeView({
									model: new Directory({
										name: data.name
									}),
									packageVersion: self.model,
									selectable: self.selectable,
									selectedFileName: self.options.selectedFileName
								})
							);
						} else {

							// top level is a file
							//
							self.contents.show(
								new PackageVersionDirectoryTreeView({
									model: new Directory({
										contents: new File({
											name: data.name
										})
									}),
									packageVersion: self.model,
									selectable: self.selectable,
									selectedFileName: self.options.selectedFileName
								})
							);
						}
					} else {

						// show complete directory tree
						//
						if (_.isArray(data)) {

							// top level is a directory listing
							//
							self.contents.show(
								new DirectoryTreeView({
									model: new Directory({
										contents: data
									}),
									packageVersion: self.model,
									selectable: self.selectable,
									selectedFileName: self.options.selectedFileName
								})
							);
						} else if (isDirectoryName(data.name)) {

							// top level is a directory
							//
							self.contents.show(
								new DirectoryTreeView({
									model: new Directory({
										name: data.name
									}),
									packageVersion: self.model,
									selectable: self.selectable,
									selectedFileName: self.options.selectedFileName
								})
							);
						} else {

							// top level is a file
							//
							self.contents.show(
								new DirectoryTreeView({
									model: new Directory({
										contents: new File({
											name: data.name
										})
									}),
									packageVersion: self.model,
									selectable: self.selectable,
									selectedFileName: self.options.selectedFileName
								})
							);		
						}
					}
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get a file tree for this package version."
						})
					);	
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
		},

		onKeyPress: function(event) {

			// respond to enter key press
			//
	        if (event.keyCode === 13) {
	            this.onClickOk();
	            Registry.application.modal.hide();
	        }
		}
	});
});
