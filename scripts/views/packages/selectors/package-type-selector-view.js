/******************************************************************************\
|                                                                              |
|                             package-type-selector-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting a software package type             |
|        from a list.                                                          |
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
	'text!templates/widgets/selectors/name-selector.tpl',
	'registry',
	'collections/packages/packages',
	'views/dialogs/error-view',
	'views/widgets/selectors/name-selector-view'
], function($, _, Backbone, Template, Registry, Packages, ErrorView, NameSelectorView) {
	return NameSelectorView.extend({

		//
		// methods
		//

		initialize: function(attributes, options) {
			var self = this;
			this.collection = new Backbone.Collection();

			// convert initial value string to object
			//
			if (this.options.initialValue && typeof(this.options.initialValue) == 'string') {
				this.options.initialValue = new Backbone.Model({
					name: this.options.initialValue
				});
			}

			// call superclass method
			//
			NameSelectorView.prototype.initialize.call(this, this.options);

			// fetch package types
			//
			Packages.fetchTypes({

				// callbacks
				//
				success: function(data) {

					// get type names
					//
					var types = [{
						name: 'Any'
					}];
					for (var i = 0; i < data.length; i++) {
						types.push({
							name: data[i].name
						});
					}

					// set attributes
					//
					self.collection = new Backbone.Collection(types);
					
					// render
					//
					self.render();
				},

				error: function() {

					// show error dialog
					//
					Registry.application.modal.show(
						new ErrorView({
							message: "Could not fetch package types."
						})
					);
				}			
			});
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				selected: this.selected? this.selected.get('name') : undefined
			}));
		},

		//
		// query methods
		//

		getSelectedName: function() {
			var selected = this.getSelected();
			if (selected) {
				return selected.get('name')
			} else {
				return 'any type';
			}
		}
	});
});
