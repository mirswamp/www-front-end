/******************************************************************************\
|                                                                              |
|                         review-packages-list-item-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single item belonging to         |
|        a list of packages for review.                                        |
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
	'bootstrap/dropdown',
	'text!templates/packages/review/review-packages-list/review-packages-list-item.tpl',
	'views/packages/list/packages-list-item-view',
	'utilities/time/date-format',
	'utilities/time/date-utils'
], function($, _, Dropdown, Template, PackagesListItemView) {
	return PackagesListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),
		
		events: {
			'click a.approved': 'onClickApproved',
			'click a.declined': 'onClickDeclined',
			'click a.revoked': 'onClickRevoked',
			'click a.unrevoked': 'onClickUnrevoked',
			'click a.pending': 'onClickPending',
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				typeName: this.model.getPackageTypeName(),
				url: this.model.getAppUrl(),
				isDeactivated: this.model.isDeactivated(),
				showDelete: this.options.showDelete,
				showDeactivatedPackages: this.options.showDeactivatedPackages
			};
		},

		//
		// event handling methods
		//

		onClickApproved: function() {
			this.model.setStatus('approved');
			this.render();
		},

		onClickDeclined: function() {
			this.model.setStatus('declined');
			this.render();
		},

		onClickRevoked: function() {
			this.model.setStatus('revoked');
			this.render();
		},

		onClickUnrevoked: function() {
			this.model.setStatus('unrevoked');
			this.render();
		},

		onClickPending: function() {
			this.model.setStatus('pending');
			this.render();
		},

		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete Package",
				message: "Are you sure that you want to delete package " + this.model.get('name') + "?",

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
								message: "Could not delete this package."
							});
						}
					});
				}
			});
		}
	});
});
