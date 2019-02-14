/******************************************************************************\
|                                                                              |
|                                 change-trackable.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|       This defines a model behavior for change trackable backbone modes.     |
|       The issue is that by default, the isDirty flag for models reflects     |
|       changes since the last "set", not since the last "sync" or "save".     |
|       This mixin changes the behavior to the second, more desirable one.     |
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
	return {

		//
		// attributes
		//

		hasChangedSinceLastSync: false,

		//
		// methods
		//
		initialize: function() {
			var self = this;

			// If you extend this model, make sure to call this initialize method
			// or add the following line to the extended model as well
			//
			this.listenTo(this, 'change', function() {
				this.hasChangedSinceLastSync = true;
			});
		},

		hasChanged: function() {
			return this.hasChangedSinceLastSync;
		},

		//
		// ajax methods
		//

		sync: function(method, model, options) {
			options = options || {};
			var success = options.success;

			options.success = function(resp) {
				success && success(resp);
				model.hasChangedSinceLastSync = false;
			};
			
			return Backbone.sync(method, model, options);
		}
	}
});
