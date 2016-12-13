/******************************************************************************\
|                                                                              |
|                        select-package-version-item-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog that is used to select items within            |
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
	'text!templates/packages/info/versions/info/build/build-profile/dialogs/select-package-version-item.tpl',
	'registry',
	'utilities/scripting/file-utils',
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
			'click #ok': 'onClickOk'
		},

		//
		// methods
		//

		initialize: function() {

			// select only directories, not files
			//
			this.selectable = {
				files: true,
				directories: true
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

		showContents: function(data) {
			this.contents.show(
				new PackageVersionDirectoryTreeView({
					model: new Directory({
						name: data.name,
						contents: data.contents
					}),
					packageVersion: this.model,
					selectable: this.selectable
				})
			);
		},

		showAllContents: function(data) {
			this.contents.show(
				new DirectoryTreeView({
					model: new Directory({
						name: data.name,
						contents: data.contents
					}),
					packageVersion: this.model,
					selectable: this.selectable
				})
			);
		},

		fetchAndShowContents: function(dirname) {
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

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not get a file list for this package version."
						})
					);	
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

		onRender: function() {
			var self = this;

			// get root name
			//
			this.model.fetchRoot({
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
