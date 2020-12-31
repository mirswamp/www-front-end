/******************************************************************************\
|                                                                              |
|                        permission-comment-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering permission comment info.             |
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
	'text!templates/users/accounts/permissions/forms/permission-comment-form.tpl',
	'views/forms/form-view',
	'views/collections/lists/key-value-list/key-value-list-view'
], function($, _, Template, FormView, KeyValueListView) {
	return FormView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			list: '#user-data'
		},

		events: {
			'input input': 'onChange',
			'input textarea': 'onChange',
			'click input[type="checkbox"]': 'onChange'
		},

		//
		// form attributes
		//

		rules: {
			'accept-policy': {
				required: true
			}
		},

		//
		// querying methods
		//

		getValues: function() {
			return {
				comment: this.$el.find("#comment").val()
			};
		},

		//
		// rendering methods
		//

		templateContext: function() {
			var isAdmin = application.session.user.isAdmin();

			return {
				policy: !isAdmin? this.model.get('policy') : null,
				showUserJustification: this.options.changeUserPermissions,
				showUserData: isAdmin,
				showComment: true
			};
		},

		onRender: function() {

			// show child views
			//
			if (this.model.has('meta_information')) {
				this.showUserData();
			}

			// call superclass method
			//
			FormView.prototype.onRender.call(this);
		},

		showUserData: function() {
			this.showChildView('list', new KeyValueListView({
				array: this.model.get('meta_information'),
				editable: false,
			}));
		},

		showWarning: function() {
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		onClickAlertClose: function() {
			this.hideWarning();
		},
		
		//
		// event handling methods
		//

		onChange: function(event) {

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		}
	});
});
