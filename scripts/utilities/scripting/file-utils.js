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
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

function isDirectoryName(name) {
	return name && (typeof(name) == 'string') && name.endsWith('/');
}

function getDirectoryName(path) {
	if (path.contains('/')) {
		return path.substr(0, path.lastIndexOf('/'));
	} else {
		return path;
	}
}