/******************************************************************************\
|                                                                              |
|                                    directory.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a directory.                                  |
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
	'backbone',
	'models/files/file',
	'utilities/scripting/file-utils'
], function($, _, Backbone, File, FileUtils) {

	//
	// utility methods
	//

	function toPath(path) {
		if (!path.endsWith('/')) {
			path += '/';
		}
		return path;
	}

	//
	// model
	//

	var Class = Backbone.Model.extend({

		//
		// attributes
		//

		/*
		defaults: {
			'name': './'
		},
		*/

		//
		// path manipulation methods
		//

		getRelativePathTo: function(path) {
			var sourcePath = toPath(this.get('name'));
			var targetPath = path;
			return getRelativePathBetween(sourcePath, targetPath);
		},

		getPathTo: function(path) {

			// clear leading slashes
			//
			if (path.startsWith('/')) {
				path = subpath(path);
			}

			var targetPath = toPath(this.get('name'));
			if (path == '.') {
				return targetPath;
			} else {

				// dereference path
				//
				while (path.startsWith('../')) {
					targetPath = dirname(targetPath) + '/';
					path = subpath(path);
				}

				// append
				//
				targetPath += path;
			}

			return targetPath;
		},

		initialize: function() {

			// set contents of non-empty directories
			//
			if (this.has('contents')) {
				this.setContents(this.get('contents'));
			}
		},

		setContents: function(contents) {

			// convert contents to files and directories
			//
			if (contents) {
				for (var i = 0; i < contents.length; i++) {
					var item = contents[i];
					var name = item.name;

					// create new directory or file
					//
					if (item.name[item.name.length - 1] == '/') {
						item = new Class(item);
					} else {
						item = new File(item);
					}
					contents[i] = item;
				}
			}

			// create collection
			//
			this.set({
				'contents': new Backbone.Collection(contents)
			});	
		}
	});
	
	return Class;
});