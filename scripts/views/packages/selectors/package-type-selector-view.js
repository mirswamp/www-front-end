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
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/widgets/selectors/name-selector.tpl',
	'collections/packages/packages',
	'collections/packages/package-types',
	'views/widgets/selectors/name-selector-view'
], function($, _, Template, Packages, PackageTypes, NameSelectorView) {
	return NameSelectorView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// constructor
		//

		initialize: function(options) {
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
			new PackageTypes().fetch({

				// callbacks
				//
				success: function(collection) {

					// get type names
					//
					var types = [{
						name: 'Any'
					}];
					for (var i = 0; i < collection.length; i++) {
						if (collection.at(i).isEnabled()) {
							types.push({
								name: collection.at(i).get('name')
							});
						}
					}

					// set attributes
					//
					self.collection = new Backbone.Collection(types);
					
					// render
					//
					self.render();
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch package types."
					});
				}			
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				selected: this.selected? this.selected.get('name') : undefined
			};
		},

		//
		// query methods
		//

		getSelectedName: function() {
			var selected = this.getSelected();
			if (selected) {
				return selected.get('name');
			} else {
				return 'any type';
			}
		}
	});
});
