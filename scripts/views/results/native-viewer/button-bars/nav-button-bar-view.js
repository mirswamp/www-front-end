/******************************************************************************\
|                                                                              |
|                              nav-button-bar-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for navigation using the menu bar.           |
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
	'text!templates/results/native-viewer/button-bars/nav-button-bar.tpl'
], function($, _, Backbone, Marionette, Template) {
	'use strict';
	
	// pre-compile template
	//
	var _template = _.template(Template);

	return Marionette.ItemView.extend({

		//
		// attributes
		//

		className: 'button-bar',

		events: {
			'change #items-per-page input': 'onChangeItemsPerPage',
			'click #first': 'onClickFirst',
			'click #prev': 'onClickPrev',
			'change #page-number': 'onChangePageNumber',
			'click #next': 'onClickNext',
			'click #last': 'onClickLast'
		},

		//
		// constructor
		//

		initialize: function() {
			this.itemsPerPage = this.options.itemsPerPage;
			this.pageNumber = this.options.pageNumber || 1;
			this.numPages = this.options.numPages || 1;
		},

		//
		// querying methods
		//

		getItemsPerPage: function() {
			return parseInt(this.$el.find('#items-per-page input').val());
		},

		getPageNumber: function() {
			if (this.numPages > 1) {
				return parseInt(this.$el.find('#page-number').val());
			} else {
				return 1;
			}
		},

		//
		// setting methods
		//

		setItemsPerPage: function(itemsPerPage) {
			this.$el.find('#items-per-page input').val(itemsPerPage);	
		},

		setPageNumber: function(pageNumber) {
			this.$el.find('#page-number').val(pageNumber);
		},

		setNumPages: function(numPages) {
			this.$el.find('#num-pages').html(numPages);
		},

		//
		// rendering methods
		//

		template: function() {
			return _template({
				itemsPerPage: this.itemsPerPage,
				pageNumber: this.pageNumber,
				numPages: this.numPages
			});
		},

		onRender: function() {
			this.addTooltips();
		},

		addTooltips: function() {
			var self = this;
			require([
				'bootstrap/tooltip'
			], function () {

				// show tooltips on hover
				//
				self.$el.find('[data-toggle="tooltip"]').tooltip({
					trigger: 'hover'
				});
			});
		},

		//
		// event handling methods
		//

		onChangeItemsPerPage: function() {
			var itemsPerPage = this.getItemsPerPage();
			if (itemsPerPage <= 0) {
				this.setItemsPerPage(1);
				itemsPerPage = 1;
			} else if (itemsPerPage > this.options.maxItemsPerPage) {
				this.setItemsPerPage(this.options.maxItemsPerPage);
				itemsPerPage = this.options.maxItemsPerPage;
			} else if (isNaN(itemsPerPage)) {
				this.setItemsPerPage(this.options.itemsPerPage);
				itemsPerPage = this.options.itemsPerPage;
			}
			this.options.parent.itemsPerPage = itemsPerPage;
			this.options.parent.setPage();
		},

		onClickFirst: function() {
			this.options.parent.setPage(1);
		},

		onClickPrev: function() {
			this.options.parent.setPage(this.getPageNumber() - 1);
		},

		onChangePageNumber: function() {
			var pageNumber = this.getPageNumber();
			if (pageNumber <= 0 || isNaN(pageNumber)) {
				this.setPageNumber(1);
				pageNumber = 1;
			} else if (pageNumber > this.numPages) {
				this.setPageNumber(this.numPages);
				pageNumber = this.numPages;
			}
			this.options.parent.setPage(pageNumber);
		},

		onClickNext: function() {
			this.options.parent.setPage(this.getPageNumber() + 1);
		},

		onClickLast: function() {
			this.options.parent.setPage(this.numPages);
		}
	});
});