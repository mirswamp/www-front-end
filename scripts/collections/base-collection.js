/******************************************************************************\
|                                                                              |
|                                 base-collection.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a base collection and generic utility methods.      |
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
	'backbone'
], function($, _, Backbone) {
	return Backbone.Collection.extend({

		//
		// querying methods
		//

		getAttributes: function(attribute) {
			var attributes = [];

			this.each(function(item) {
				attributes.push(item.get(attribute));
			});

			return attributes;
		},

		contains: function(model) {
			for (var i = 0; i < this.length; i++) {
				var item = this.at(i);
				if (item == model) {
					return true;
				} else if (item.isSameAs && item.isSameAs(model)) {
					return true;
				}
			}
			return false;
		},

		//
		// bulk operation methods
		//

		save: function(options) {
			var self = this;

			// save models individually
			//
			var saves = 0, successes = 0, errors = 0;
			for (var i = 0; i < this.length; i++) {
				var model = this.at(i);

				if (model.isNew() || model.hasChanged()) {
					saves++;
					model.save(undefined, {

						// callbacks
						//
						success: function() {
							successes++;

							// report success when completed
							//
							if (i === self.length && successes === saves) {
								if (options.success) {
									options.success();
								}
							}
						},

						error: function() {
							errors++;

							// report first error
							//
							if (errors === 1) {
								if (options.error) {
									options.error();
								}
							}
						}
					});
				}
			}

			// check for no changes
			//
			if (saves === 0) {

				// report success when completed
				//
				if (options.success) {
					options.success();
				}
			}
		},

		destroy: function(options) {
			var self = this;

			// destroy models individually
			//
			var successes = 0, errors = 0, count = this.length;
			for (var i = 0; i < count; i++) {
				var item = this.pop();
				item.destroy({

					// callbacks
					//
					success: function() {
						successes++;

						// perform callback when complete
						//
						if (successes === count) {
							if (options.success) {
								self.reset();
								options.success();
							}
						}
					},

					error: function() {
						errors++;

						// report first error
						//
						if (errors === 1 && options.error) {
							options.error();
						}
					}
				});
			}

			// check for no changes
			//
			if (count === 0) {

				// report success when completed
				//
				if (options.success) {
					options.success();
				}
			}
		},

		//
		// filtering methods
		//

		getByAttribute: function(attribute, value) {

			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			this.each(function(item) {
				if (item.get(attribute).toLowerCase() == value) {
					collection.add(item);
				}
			});

			return collection;
		},

		getByNotAttribute: function(attribute, value) {

			// create empty collection
			//
			var collection = new this.constructor([], {
				model: this.model,
				comparator: this.comparator
			});

			this.each(function(item) {
				if (item.get(attribute).toLowerCase() != value) {
					collection.add(item);
				}
			});

			return collection;
		},

		//
		// sorting methods
		//

		sortByAttribute: function(attribute, options) {
			this.reset(this.sortBy(function(item) { 
				if (options && options.comparator) {
					return options.comparator(item.get(attribute));
				} else {
					return item.get(attribute);
				}
			}));
			if (options && options.reverse) {
				this.reverse();
			}
		},

		sortedByAttribute: function(attribute, options) {
			var sorted = new this.constructor(this.sortBy(function(item) { 
				if (options && options.comparator) {
					return options.comparator(item.get(attribute));
				} else {
					return item.get(attribute);
				}
			}));
			if (options && options.reverse) {
				sorted.reverse();
			}
			return sorted;
		},

		//
		// ordering methods
		//

		reverse: function() {
			var models = this.models;
			this.reset();
			this.add(models.reverse());
		}
	});
});