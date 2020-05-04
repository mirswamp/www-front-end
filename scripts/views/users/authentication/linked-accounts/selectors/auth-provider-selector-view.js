/******************************************************************************\
|                                                                              |
|                          auth-provider-selector-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting authorization providers.            |
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
	'select2',
	'collections/authentication/auth-providers',
	'views/widgets/selectors/grouped-name-selector-view'
], function($, _, Select2, AuthProviders, GroupedNameSelectorView) {
	return GroupedNameSelectorView.extend({

		//
		// contructor
		//

		initialize: function() {

			// call superclass method
			//
			GroupedNameSelectorView.prototype.initialize.call(this);

			// set attributes
			//
			this.selected = null;
			this.collection = new AuthProviders();

			// fetch and display
			//
			this.update();
		},

		//
		// rendering methods
		//

		update: function(options) {
			var self = this;

			// fetch tools
			//
			this.collection.fetch({
				
				// callbacks
				//
				success: function(collection) {

					// filter out exceptions
					//
					if (self.options.except) {
						collection = new Backbone.Collection(collection.filter(function(model) {
							return !self.options.except.hasItemNamed(model.get('entityid'));
						}));
						self.collection = collection;
					}

					// save original list of providers
					//
					self.providers = self.collection.clone();

					// divide providers into groups
					//
					var academicProviders = new Backbone.Collection(self.collection.filter(function(model) {
						var name = model.get('name');

						// filter on name
						//
						return name.contains('University') || name.contains('College') || 
							name.contains('School') || name.contains('Institute') || 
							name.contains('State') || name == 'Johns Hopkins';
					}));

					// remove from providers list
					//
					academicProviders.each(function(model) {
						self.collection.remove(model);
					});

					self.collection = new Backbone.Collection([{
						'name': 'Academic Providers',
						'group': academicProviders
					}, {
						'name': 'Other Providers',
						'group': self.collection
					}]);

					// set initial selected
					//
					if (application.options.authProvider) {
						self.selected = self.providers.findWhere({
							name: application.options.authProvider
						});
					}
					
					// render
					//
					self.render();
					
					// perform callback
					//
					if (options && options.done) {
						options.done();
					}
				}, 

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch authentication providers."
					});
				}
			});
		}
	});
});
