/******************************************************************************\
|                                                                              |
|                              project-profile-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a project's profile information.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/projects/info/project-profile/project-profile.tpl',
	'models/viewers/viewer',
	'views/base-view',
	'utilities/time/date-utils'
], function($, _, Template, Viewer, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			var owner = this.model.get('owner');

			return {
				projectType: this.model.getProjectType(),
				ownerName: owner? owner.getFullName() : undefined,
				ownerEmail: owner? owner.get('email') : undefined
			};
		}
	});
});
