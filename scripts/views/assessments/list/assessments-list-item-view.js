/******************************************************************************\
|                                                                              |
|                            assessments-list-item-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single assessment item.             |
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
	'text!templates/assessments/list/assessments-list-item.tpl',
	'registry',
	'models/assessments/assessment-run',
	'models/packages/package',
	'models/packages/package-version',
	'models/tools/tool',
	'models/tools/tool-version',
	'models/platforms/platform',
	'models/platforms/platform-version',
	'views/dialogs/confirm-view',
	'views/dialogs/notify-view',
	'views/dialogs/error-view',
], function($, _, Backbone, Marionette, Template, Registry, AssessmentRun, Package, PackageVersion, Tool, ToolVersion, Platform, PlatformVersion, ConfirmView, NotifyView, ErrorView) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		tagName: 'tr',

		events: {
			'click button.delete': 'onClickDelete'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				index: this.options.index,
				showNumbering: this.options.showNumbering,
				packageUrl: Registry.application.getURL() + '#packages/' + data.package_uuid,
				packageVersionUrl: data.package_version_uuid? Registry.application.getURL() + '#packages/versions/' + data.package_version_uuid : undefined,
				toolUrl: Registry.application.getURL() + '#tools/' + data.tool_uuid,
				toolVersionUrl: data.tool_version_uuid? Registry.application.getURL() + '#tools/versions/' + data.tool_version_uuid : undefined,
				platformUrl: Registry.application.getURL() + '#platforms/' + data.platform_uuid,
				platformVersionUrl: data.platform_version_uuid? Registry.application.getURL() + '#platforms/versions/' + data.platform_version_uuid : undefined
			}));
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;

			// show confirm dialog
			//
			Registry.application.modal.show(
				new ConfirmView({
					title: "Delete Assessment",
					message: "Are you sure that you want to delete this assessment of " + this.model.get('package_name') + " using " + this.model.get('tool_name') + " on " + this.model.get('platform_name') + "?",

					// callbacks
					//
					accept: function() {
						var assessmentRun = new AssessmentRun();
						self.model.url = assessmentRun.url;

						// delete model from database
						//
						self.model.destroy({

							// callbacks
							//
							error: function() {

								// show error dialog
								//
								Registry.application.modal.show(
									new ErrorView({
										message: "Could not delete this assessment."
									})
								);
							}
						});
					}
				})
			);
		}
	});
});