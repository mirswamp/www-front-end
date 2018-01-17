/******************************************************************************\
|                                                                              |
|                               execution-records.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of execution records.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2018 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'models/assessments/execution-record',
	'collections/base-collection'
], function($, _, Backbone, Config, ExecutionRecord, BaseCollection) {
	return BaseCollection.extend({

		//
		// Backbone attributes
		//

		model: ExecutionRecord,

		//
		// querying methods
		//

		equalTo: function(collection) {
			if (this.length != collection.length) {
				return false;
			} else {
				for (var i = 0; i < collection.length; i++) {
					if (!this.at(i).equalTo(collection.at(i))) {
						return false;
					}
				}
			}
			return true;
		},

		//
		// batch methods
		//
		
		killAll: function(options) {
			var self = this;
			var successes = 0, failures = 0;

			function finish() {
				if (failures) {
					if (options && options.error) {
						options.error();
					}
				} else {
					if (options && options.success) {
						options.success();
					}
				}
			}

			// destroy models individually
			//
			function kill(item) {
				item.kill({

					// callbacks
					//
					success: function() {
						successes++;
						if (self.length > 0) {
							kill(self.pop());
						} else {
							finish();	
						}
					},

					error: function() {
						failures++;
						if (self.length > 0) {
							kill(self.pop());
						} else {
							finish();
						}	
					}
				});
					
			}

			// check for empty 
			//
			if (this.length === 0) {

				// report success when completed
				//
				if (options.success) {
					options.success();
					return;
				}
			}

			if (options && options.async) {

				// kill items asynchronously - don't wait for each kill
				// to finish before proceeding to the next item
				//	
				var count = this.length;	
				for (var i = 0; i < count; i++) {
					var item = this.pop();
					item.kill({

						// callbacks
						//
						success: function() {
							successes++;

							// perform callback when complete
							//
							if (successes === count) {
								if (options.success) {
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
			} else {

				// kill items sequentially - wait for each kill to finish
				// before proceeding to the next item
				//
				if (this.length > 0) {
					kill(this.pop());
				}
			}
		},

		//
		// ajax methods
		//

		fetchAll: function(options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/execution_records/all'
			}));
		},

		fetchByProject: function(project, options) {
			return this.fetch(_.extend(options, {
				url: Config.servers.web + '/projects/' + project.get('project_uid') + '/execution_records'
			}));
		},

		fetchByProjects: function(projects, options) {
			return Backbone.Collection.prototype.fetch.call(this, _.extend(options, {
				url: Config.servers.web + '/projects/' + projects.getUuidsStr() + '/execution_records'
			}));
		},
	}, {

		//
		// static methods
		//

		fetchNumByProject: function(project, options) {
			return $.ajax(Config.servers.web + '/projects/' + project.get('project_uid') + '/execution_records/num', options);
		},

		fetchNumByProjects: function(projects, options) {
			return $.ajax(Config.servers.web + '/projects/' +  projects.getUuidsStr() + '/execution_records/num', options);
		},		
	});
});
