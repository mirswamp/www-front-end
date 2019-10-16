/******************************************************************************\
|                                                                              |
|                           new-package-source-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for editing a new package's source              |
|        information.                                                          |
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
	'text!templates/packages/info/source/new-package-source.tpl',
	'views/base-view',
	'views/packages/info/source/source-profile/package-source-profile-form-view'
], function($, _, Template, BaseView, PackageSourceProfileFormView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			form: '#package-source-profile-form'
		},

		events: {
			'click .alert-info .close': 'onClickAlertInfoClose',
			'click .alert-warning .close': 'onClickAlertWarningClose',
			'click #prev': 'onClickPrev',
			'click #next': 'onClickNext',
			'click #cancel': 'onClickCancel'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				package: this.model
			};
		},

		onRender: function() {
			this.showSourceProfileForm();
		},

		showSourceProfileForm: function() {

			// show source profile form view
			//
			this.showChildView('form', new PackageSourceProfileFormView({
				model: this.options.packageVersion,
				package: this.model,
				parent: this
			}));
		},

		showNotice: function(message) {
			this.$el.find('.alert-info').find('.message').html(message);
			this.$el.find('.alert-info').show();
		},

		hideNotice: function() {
			this.$el.find('.alert-info').hide();
		},
		
		showWarning: function(message) {
			if (message) {
				this.$el.find('.alert-warning .message').html(message);
			}
			this.$el.find('.alert-warning').show();
		},

		hideWarning: function() {
			this.$el.find('.alert-warning').hide();
		},

		//
		// event handling methods
		//

		onClickAlertInfoClose: function() {
			this.hideNotice();
		},

		onClickAlertWarningClose: function() {
			this.hideWarning();
		},

		onClickPrev: function() {
			this.options.parent.showDetails();
		},

		onClickNext: function() {

			// check validation
			//
			if (this.getChildView('form').isValid()) {

				// update package and package version
				//
				this.getChildView('form').applyTo(this.model, this.options.packageVersion);

				// go to next view
				//
				this.options.parent.showBuild();
			} else {

				// show warning
				//
				this.showWarning();
			}
		},

		onClickCancel: function() {

			// go to packages view
			//
			Backbone.history.navigate('#packages', {
				trigger: true
			});
		}
	});
});
