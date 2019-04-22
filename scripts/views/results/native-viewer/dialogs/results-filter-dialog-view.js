/******************************************************************************\
|                                                                              |
|                        results-filter-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog used to filter results by bug code.             |
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
	'text!templates/results/native-viewer/dialogs/results-filter-dialog.tpl',
	'registry'
], function($, _, Backbone, Marionette, Template, Registry) {
	return Backbone.Marionette.ItemView.extend({

		//
		// attributes
		//

		events: {
			'click #all': 'onClickAll',
			'click #ok': 'onClickOk'
		},

		//
		// querying methods
		//

		getFilterType: function() {
			if (this.$el.find('input#all').is(':checked')) {
				return 'exclude';
			} else {
				return 'include';
			}
		},

		getFilter: function(type) {
			switch (type || this.getFilterType()) {
				case 'include':
					return this.getIncludeFilter();
				case 'exclude':
					return this.getExcludeFilter();
			}
		},

		getExcludeFilter: function() {
			var filter = [];
			var checkboxes = this.$el.find('input[type="checkbox"]:not(:checked)');
			for (var i = 0; i < checkboxes.length; i++) {
				filter.push($(checkboxes[i]).attr('id'));
			}
			return filter;
		},

		getIncludeFilter: function() {
			var filter = [];
			var checkboxes = this.$el.find('input[type="checkbox"]:checked');
			for (var i = 0; i < checkboxes.length; i++) {
				filter.push($(checkboxes[i]).attr('id'));
			}
			return filter;
		},

		//
		// rendering methods
		//

		template: function() {
			return _.template(Template, {
				title: this.options.title,
				catalog: this.options.catalog,
				filter_type: this.options.filter_type,
				filter: this.options.filter,
			});
		},

		checkAll: function() {
			this.$el.find('input[type="checkbox"]').prop('checked', true);
		},

		uncheckAll: function() {
			this.$el.find('input[type="checkbox"]').prop('checked', false);
		},

		//
		// event handling methods
		//

		onClickAll: function() {
			var checked = this.$el.find('#all').is(':checked');
			if (checked) {
				this.checkAll();
			} else {
				this.uncheckAll();
			}
		},

		onClickOk: function() {

			// dismiss modal dialog
			//
			Registry.application.modal.hide();

			// perform callback
			//
			if (this.options.accept) {
				this.options.accept({
					filter_type: this.getFilterType(),
					filter: this.getFilter()
				});
			}
		}
	});
});
