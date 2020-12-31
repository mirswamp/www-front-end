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
|        Copyright (C) 2012-2020 Morgridge Institute for Research (MIR)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap.select',
	'text!templates/widgets/selectors/country-selector.tpl',
	'models/utilities/country',
	'collections/utilities/countries',
	'views/widgets/selectors/name-selector-view'
], function($, _, Select, Template, Country, Countries, NameSelectorView) {
	return NameSelectorView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// constructor
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
					});
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

					// show error message
					//
					application.error({
						message: "Could not fetch list of countries."
					});
				}
			});
		},

		//
		// rendering methods
		//

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
