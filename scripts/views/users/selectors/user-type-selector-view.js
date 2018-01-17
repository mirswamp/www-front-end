/******************************************************************************\
|                                                                              |
|                             user-type-selector-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting a software user type                |
|        from a list.                                                          |
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
	'text!templates/widgets/selectors/name-selector.tpl',
	'views/widgets/selectors/name-selector-view'
], function($, _, Backbone, Template, NameSelectorView) {
	return NameSelectorView.extend({

		//
		// methods
		//

		initialize: function(attributes, options) {
			var self = this;
			this.collection = new Backbone.Collection([{
					name: 'Any',
					value: undefined
				}, {
					name: 'Individual',
					value: 'individual'
				}, {
					name: 'Educational',
					value: 'educational'
				}, {
					name: 'Government',
					value: 'government'
				}, {
					name: 'Commercial',
					value: 'commercial'
				}, {
					name: 'Open Source',
					value: 'open-source'
				}, {
					name: 'Test',
					value: 'test'
				}
			]);

			// call superclass method
			//
			NameSelectorView.prototype.initialize.call(this, this.options);
		},

		//
		// rendering methods
		//

		template: function(data) {
			var selectedItem = this.collection.where({ value: this.selected });
			return _.template(Template, _.extend(data, {
				selected: selectedItem? selectedItem[0].get('name') : undefined
			}));
		},

		//
		// query methods
		//

		getSelectedValue: function() {
			var selected = this.getSelected();
			if (typeof selected == 'string') {
				return selected;
			} else if (typeof selected == 'object') {
				return selected.get('value');
			}
		}
	});
});
