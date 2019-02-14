/******************************************************************************\
|                                                                              |
|                        package-version-gem-info-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog that is used to view info from a Gemfile.      |
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
	'marionette',
	'text!templates/packages/info/versions/info/source/dialogs/package-version-gem-info.tpl',
	'models/packages/package-version'
], function($, _, Backbone, Marionette, Template, PackageVersion) {

	//
	// utility methods
	//

	function gemItemToHTML(item) {

		// comments
		//
		if (item['comment']) {
			return $('<div class="comment">').append(item['comment']);

		// symbols
		//
		} else if (item['symbol']) {
			var el = $('<div class="symbol">').append(gemItemToHTML(item['symbol']));

			// add symbol value
			//
			if (item['value']) {
				el.append($('<div class="value">').append(gemItemToHTML(item['value'])));
			}

			return el;

		// string literals
		//	
		} else if (item['strlit']) {
			return $('<div class="strlit">').append(item['strlit']);

		// string literals
		//	
		} else if (item['strlit2']) {
			return $('<div class="strlit2">').append(item['strlit2']);

		// requires
		//
		} else if (item['require']) {
			return $('<div class="require">').append(gemItemToHTML(item['require']));

		// variables and constants
		//			
		} else {
			return item;
		}
	}

	function gemItemsToHTML(items) {
		var el = $('<ul>');
		for (var i = 0; i < items.length; i++) {

			// convert element to HTML
			//
			el.append($('<li>').append(gemItemToHTML(items[i])));
		}
		return el;
	}

	function gemInfoToHTML(gemInfo) {
		var el = $('<div>');

		//gemInfoEl.append($('<p>'));

		for (var i = 0; i < gemInfo.length; i++) {
			var item = gemInfo[i];

			// comments
			//
			if (item['comment']) {
				el.append($('<div class="comment">').append(item['comment']));

			// ruby
			//
			} else if (item['source']) {
				el.append($('<div class="source">').append(gemItemToHTML(item['source'])));

			// ruby
			//
			} else if (item['ruby']) {
				el.append($('<div class="ruby">').append(gemItemToHTML(item['ruby'])));

			// gems
			//
			} else if (item['gem']) {
				el.append($('<div class="gem">').append(gemItemsToHTML(item['gem'])));

			// groups
			//
			} else if (item['group']) {
				var group = $('<div class="group">');

				// add id
				//
				el.append(group.append($('<div class="id">').append(gemItemsToHTML(item['group']))));
				
				// add gems
				//
				var gems = item['gems'];
				for (var j = 0; j < gems.length; j++) {
					var gem = gems[j]['gem'];
					group.append($('<div class="gem">').append(gemItemsToHTML(gem)));
				}
				
				el.append(group);
			} else {

				// other code
				//
				el.append($('<div class="code">').append(item));
			}
		}

		return el;
	}

	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		regions: {
			gemInfo: '#gem-info'
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
				packagePath: this.options.packagePath
			});
		},

		onRender: function() {
			var self = this;

			// fetch ruby gem info
			//
			this.model.fetchRubyGemInfo({

				data: {
					'dirname': this.options.packagePath
				},

				// callbacks
				//
				success: function(gemInfo) {
					self.$el.find('#gem-info').append(gemInfoToHTML(gemInfo));
				},

				error: function() {
					self.$el.find('#gem-info').append("No information is available.")
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
