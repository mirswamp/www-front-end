/******************************************************************************\
|                                                                              |
|                                rest-client-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a confirmation modal dialog box that is used to          |
|        prompt the user for confirmation to proceed with some action.         |
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
	'marionette',
	'tab',
	'popover',
	'config',
	'registry',
	'text!templates/api/dialogs/rest-client/rest-client.tpl',
	'views/api/dialogs/rest-client/key-value-list/key-value-list-view'
], function($, _, Backbone, Marionette, Tab, Popover, Config, Registry, Template, KeyValueListView) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		regions: {
			'requestBody': '#request-body',
			'requestHeaders': '#request-headers'
		},

		events: {
			'change #method': 'onChange',
			'change #route': 'onChange',
			'keydown #route': 'onChange',
			'keyup #route': 'onChange',
			'click #view-command-tab': 'onChange',
			'click #submit': 'onClickSubmit',
			'click #cancel': 'onClickCancel'
		},

		//
		// constructor
		//

		initialize: function() {
			if (this.options.headers) {
				if ('cookie' in this.options.headers) {
					this.options.headers.cookie = document.cookie;
				}
			}
		},

		//
		// querying methods
		//

		isHTMLContent: function(data) {
			return data && (typeof data == 'string') && 
				(data.startsWith('<html>') || data.startsWith('<!DOCTYPE html'));
		},

		//
		// querying methods
		//

		toCurl: function(method, url, headers, data) {
			var command = 'curl';

			if (method) {
				switch (method.toLowerCase()) {
					case 'post':
						command += ' -X POST';
						break;
					case 'get':
						break;
					case 'put':
						command += ' -X PUT';
						break;
					case 'delete':
						command += ' -X DELETE';
						break;
				}
			}

			// add cookie flags
			//
			if (url.endsWith('login')) {

				// write cookie dat
				//
				command += ' -c cookies.txt';
			}
			if (headers.cookie) {

				// read cookie data
				//
				command += ' -b cookies.txt';
			}

			// add data
			//
			if (data) {
				var i = 0;
				var found = false;

				for (var key in data) {
					var value = data[key];
					if (value != undefined) {

						// found some data to add
						//
						if (!found) {
							command += ' ' + '--data "';
							found = true;
						}

						// if not first parameter
						//
						if (i > 0) {
							command += '&';
						}

						command += key + '=' + value;
					}
					i++;
				}
				if (found) {
					command += '"';
				}
			}

			// add url
			//
			command += ' ' + url;

			return command;
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				method: this.model.get('method') || 'post',
				route: Config.servers[this.model.get('server')] + '/' + this.model.get('route'),
				command: ''
			}));
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
			
			// show subviews
			//
			this.requestHeaders.show(
				new KeyValueListView({
					array: this.options.headers,
					editable: true,
					showDelete: true
				})
			);
			this.requestBody.show(
				new KeyValueListView({
					array: this.options.parameters,
					editable: true,
					showDelete: true
				})
			);

		},

		showResponseStatus: function(statusCode, statusText) {
			var responseStatus = statusCode + ' ' + statusText;
			if (statusCode == 0) {
				responseStatus = '<span class="error">' + '<i class="fa fa-thumbs-down"></i>' + '&nbsp;' + responseStatus + '</span>';	
			} else if (statusCode < 300) {
				responseStatus = '<span class="success">' + '<i class="fa fa-thumbs-up"></i>' + '&nbsp;' + responseStatus + '</span>';
			} else if (statusCode >= 300 && statusCode < 400) {
				responseStatus = '<span class="warning">' + '<i class="fa fa-thumbs-down"></i>' + '&nbsp;' + responseStatus + '</span>';	
			} else if (statusCode >= 400) {
				responseStatus = '<span class="error">' + '<i class="fa fa-thumbs-down"></i>' + '&nbsp;' + responseStatus + '</span>';	
			}
			this.$el.find('#response-status').html(responseStatus);
		},

		showHTMLResponse: function(data) {
			this.$el.find('#response-json').hide();
			this.$el.find('#response-html').show();
			this.$el.find('#response-html').contents().find('html').html(data);
		},

		showJSONResponse: function(data) {
			var json = JSON.stringify(data, null, 2);
			this.$el.find('#response-html').hide();
			this.$el.find('#response-json').show();
			this.$el.find('#response-json').html('<pre>' + json + '</pre>');
		},

		showResponseHeaders: function(data) {
			this.$el.find('#response-headers').html('<pre>' + data + '</pre>');
		},

		showCurlCommand: function() {
			var method = this.$el.find('#method').val();
			var url = this.$el.find('#route').val();
			var headers = this.requestHeaders.currentView.toData();
			var data = this.requestBody.currentView.toData();
			var command = this.toCurl(method, url, headers, data);

			// show command in terminal
			//
			this.$el.find('#command').html(command.replace(/\//g, '<wbr>/<wbr>'));
		},

		//
		// event handling methods
		//

		onClickSubmit: function() {
			var self = this;
			var headers = self.requestHeaders.currentView.toData();
			var data = this.requestBody.currentView.toData();

			if (headers.cookie) {
				headers.cookie = document.cookie;
			}

			// perform ajax call
			//
			$.ajax({

				// set method / route to use
				//
				method: this.$el.find('#method').val(),
				url: this.$el.find('#route').val(),

				// set data to send
				//
				data: data,
				// headers: headers,
				xhrFields: {
					withCredentials: (headers.cookie != undefined)
				},

				// create custom Http request
				//
				beforeSend: function (xhr) {
					for (var key in headers) {
						if (key != 'cookie') {
							var value = headers[key];
							xhr.setRequestHeader(key, value);
						}
					}
				},

				xhr: function() {
					var xhr = new XMLHttpRequest();
					if (xhr.setDisableHeaderCheck) {
						xhr.setDisableHeaderCheck(true);
					}
					return xhr;
				},
			}).always(function(data, status, jqXHR) {
				if (status == 'error') {
					jqXHR = data;
				}

				// show status tab
				//
				self.$el.find('a[href="#response-content"]').tab('show');

				// show response status
				//
				self.showResponseStatus(jqXHR.status, jqXHR.statusText);

				// show response headers
				//
				self.showResponseHeaders(jqXHR.getAllResponseHeaders());

				// show response body
				//
				if (self.isHTMLContent(data)) {

					// show HTML
					//
					self.showHTMLResponse(data);
				} else if (self.isHTMLContent(data.responseText)) {

					// show HTML
					//
					self.showHTMLResponse(data.responseText);
				} else {

					// show JSON
					//
					self.showJSONResponse(data);
				}
			});
		},

		onClickCancel: function() {
			if (this.options.reject) {
				this.options.reject();
			}
		},

		onChange: function() {
			this.showCurlCommand();
		}
	});
});
