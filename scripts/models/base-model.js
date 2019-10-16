/******************************************************************************\
|                                                                              |
|                                   base-model.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a backbone base model.                        |
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
	'backbone',
], function($, _, Backbone) {
	return Backbone.Model.extend({

		//
		// querying methods
		//

		getClassName: function() {
			if (this.constructor.name) {
				return this.constructor.name;
			} else {
				return 'model';
			}
		},

		isSameAs: function(model) {
			return model && this.get(this.idAttribute) == model.get(model.idAttribute);
		},

		//
		// setting methods
		//

		update: function(attributes) {
			for (var key in attributes) {
				var value = attributes[key];
				if (value != undefined && value != null) {
					this.set(key, value);
				}
			}
		},

		//
		// overridden Backbone methods
		//

		fetch: function(options) {
			var self = this;

			// set default options
			//
			if (!options || !options.error) {
				if (!options) {
					options = {};
				}
				options.error = function() {

					// show error message
					//
					application.error({
						message: "Could not fetch " + self.getClassName() + "."
					});
				};
			}

			// call superclass method
			//
			return Backbone.Model.prototype.fetch.call(this, options);
		}
	});
});
