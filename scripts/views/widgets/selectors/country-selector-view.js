/******************************************************************************\
|                                                                              |
|                              country-selector-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for selecting a country from a list.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/widgets/selectors/country-selector.tpl',
	'registry',
	'models/utilities/country',
	'collections/utilities/countries',
	'views/dialogs/error-view',
	'views/widgets/selectors/name-selector-view'
], function($, _, Backbone, Template, Registry, Country, Countries, ErrorView, NameSelectorView) {
	return NameSelectorView.extend({

		//
		// methods
		//

		initialize: function() {
			var self = this;

			// set attributes
			//
			this.collection = new Countries();
			if (this.options.initialValue) {

				// convert type of initial value to a country
				//
				if (typeof this.options.initialValue == 'string') {
					this.options.initialValue = new Country({
						name: this.options.initialValue
					})
				}
				this.selected = this.options.initialValue;
			}

			// fetch countries
			//
			this.collection.fetch({

				// callbacks
				//
				success: function() {

					// add blank item in case users don't want
					// to specify a country
					//
					self.collection.unshift({
						name: '',
						iso: ''
					});

					// render the template
					//
					self.render();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch list of countries."
						})
					);
				}
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, data);
		},

		onRender: function() {
			if (this.options.initialValue) {

				// set selected item
				//
				var model = this.collection.findWhere({
					'name': this.options.initialValue.get('name')
				});

				this.$el.find('select')[0].selectedIndex = this.collection.indexOf(model);
			}

			// enable custom select
			//
			this.$el.find('select').selectpicker({
				showSubtext: true
			});

			// call on render callback
			//
			if (this.onrender) {
				this.onrender();
			}
		}
	});
});
