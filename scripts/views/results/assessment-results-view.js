/******************************************************************************\
|                                                                              |
|                            assessment-results-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for showing a set of assessment results.        |
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
	'text!templates/results/assessment-results.tpl',
	'views/base-view',
], function($, _, Template, BaseView) {
	return BaseView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				project: this.options.project
			};
		},

		onRender: function() {
			var self = this;

			// call stored procedure
			//
			this.model.getResults({
				timeout: 0,

				// callbacks
				//
				success: function(data) {
					if (data.results_status === 'SUCCESS') {

						// display results in new window
						//
						if (data.results) {
							// var content = $.parseHTML(data.results);
							// var assessmentResults = self.$el.find('#assessment-results');
							// assessmentResults.append(content);

							var iframe = self.$el.find('#assessment-results')[0];
							var contentWindow = iframe.contentWindow;

							// insert results into DOM
							//
							contentWindow.document.write(data.results);

							// set iframe height to height of contents
							//
							$(iframe).height(contentWindow.outerWidth);

							// call window onload, if there is one
							//
							if (contentWindow.onload) {
								contentWindow.onload();
							}
						} else if (data.results_url) {
							window.location = data.results_url;
						}
					} else {

						// display error view / results status
						//
						application.error({
							message: "Error fetching assessment results: " + data.results_status
						});
					}
				},

				error: function() {

					// show error message
					//
					application.error({
						message: "Could not fetch assessment results content."
					});
				}
			});
		}
	});
});