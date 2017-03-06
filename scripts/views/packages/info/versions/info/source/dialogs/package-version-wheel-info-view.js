/******************************************************************************\
|                                                                              |
|                       package-version-wheel-info-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog used to view info from a Wheel file.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/packages/info/versions/info/source/dialogs/package-version-wheel-info.tpl',
	'models/packages/package-version'
], function($, _, Backbone, Marionette, Template, PackageVersion) {

	//
	// utility methods
	//

	function wheelInfoToHTML(wheelInfo) {
		var el = $('<div>');
		for (var i = 0; i < wheelInfo.length; i++) {
			var item = wheelInfo[i];

			// comments
			//
			if (item['comment']) {
				el.append($('<div class="comment">').append(item['comment']));

			// key value pairs
			//
			} else for (var key in item) {
				el.append($('<div class="key-value-pair">')
					.append($('<div class="key">').append(key))
					.append($('<div class="value">').append(item[key]))
				);
			}
		}

		return el;
	}

	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			wheelInfo: '#wheel-info'
		},

		events: {
			'click #ok': 'onClickOk'
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				title: this.options.title,
				dirname: this.options.dirname
			});
		},

		onRender: function() {
			var self = this;

			// fetch python wheel info
			//
			this.model.fetchPythonWheelInfo({

				data: {
					'dirname': this.options.dirname
				},

				// callbacks
				//
				success: function(wheelInfo) {
					self.$el.find('#wheel-info').append(wheelInfoToHTML(wheelInfo));
				},

				error: function() {
					self.$el.find('#wheel-info').append("No information is available.")
				}
			});
		},

		//
		// event handling methods
		//

		onClickOk: function() {

			// apply callback
			//
			if (this.options.accept) {
				this.options.accept();
			}
		}
	});
});
