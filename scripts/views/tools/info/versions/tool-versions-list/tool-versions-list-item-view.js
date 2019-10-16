/******************************************************************************\
|                                                                              |
|                        tool-versions-list-item-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single tool list item.              |
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
	'text!templates/tools/info/versions/tool-versions-list/tool-versions-list-item.tpl',
	'views/collections/tables/table-list-item-view',
	'utilities/time/date-utils'
], function($, _, Template, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model,
				url: application.session.user? application.getURL() + '#tools/versions/' + this.model.get('tool_version_uuid') : undefined,
				showDelete: this.options.showDelete
			};
		},

		//
		// event handling methods
		//

		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete Tool Version",
				message: "Are you sure that you want to delete version " + self.model.get('version_string') + " of " + self.options.tool.get('name') + "?",

				// callbacks
				//
				accept: function() {
					self.model.destroy({
						
						// callbacks
						//
						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this tool version."
							});
						}
					});
				}
			});
		}
	});
});