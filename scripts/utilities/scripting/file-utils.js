/******************************************************************************\
|                                                                              |
|                                  file-utils.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains minor general purpose file utilities.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

function dirname(path) {

	// strip off last slash of directory names
	//
	if (path.endsWith('/')) {
		path = path.substr(0, path.length - 1);
	}

	// get directory name
	//
	return path.substr(0, path.lastIndexOf('/'));	
}

function subpath(path) {
	return path.substr(path.indexOf('/') + 1, path.length - 1);				
}

function rootPath(path) {
	return path.substr(0, path.indexOf('/'));
}

function isDirectoryName(name) {
	return name && (typeof(name) == 'string') && name.endsWith('/');
}

function getFileName(path) {

	// return string after the last slash
	//
	if (path && path.contains('/')) {
		return path.substr(path.lastIndexOf('/') + 1, path.length);
	} else {
		return path;
	}
}

function getDirectoryName(path) {

	// return string before the last slash
	//
	if (path && path.contains('/')) {
		return path.substr(0, path.lastIndexOf('/'));
	} else {
		return path;
	}
}

function getFileExtension(path) {
	if (path) {
		var filename = getFileName(path);
		if (filename.contains('.')) {
			return filename.split('.').pop();
		} else {
			return null;
		}
	} else {
		return null;
	}
}

function getRelativePathBetween(sourcePath, targetPath) {
	var path;

	// clear leading slashes
	//
	if (sourcePath.startsWith('/')) {
		sourcePath = subpath(sourcePath);
	}
	if (targetPath.startsWith('/')) {
		targetPath = subpath(targetPath);
	}

	// clear leading single dots
	//
	if (sourcePath.startsWith('./')) {
		sourcePath = subpath(sourcePath);
	}

	// source path is current directory
	//
	if (sourcePath == '.' || sourcePath == '/') {
		path = targetPath;

	// target path is the same as source path
	//
	} else if (targetPath == sourcePath) {
		path = '.';

	// target path starts with source path
	//
	} else if (targetPath.startsWith(sourcePath)) {
		path = targetPath.replace(sourcePath, '');

	// target path is contained by source path
	//
	} else if (sourcePath.contains(targetPath)) {
		sourcePath = sourcePath.replace(targetPath, '');
		path = '';
		for (var i = 1; i < sourcePath.split('/').length; i++) {
			path = '../' + path;
		}

	// handle .. paths
	//
	} else if (rootPath(targetPath) == '..') {
		while (rootPath(targetPath) == '..') {
			sourcePath = dirname(sourcePath);
			targetPath = subpath(targetPath);
		}
		path = sourcePath + '/' + targetPath;

	// target path is outside of source path
	//
	} else {

		// go up one level
		//
		path = '../' + getRelativePathBetween(dirname(sourcePath) + '/', targetPath);
	}

	return path;
}