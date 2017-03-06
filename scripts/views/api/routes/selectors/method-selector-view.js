/******************************************************************************\
|                                                                              |
|                               method-selector-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for selecting an api route method type.           |
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
	'text!templates/widgets/selectors/name-selector.tpl',
	'registry',
	'views/dialogs/error-view',
	'views/widgets/selectors/name-selector-view'
], function($, _, Backbone, Template, Registry, ErrorView, NameSelectorView) {
	return NameSelectorView.extend({

		//
		// methods
		//

		initialize: function(attributes, options) {
			this.collection = new Backbone.Collection([
				{
					name: 'Any'
				},
				{
					name: 'POST'
				},
				{
					name: 'GET'
				},
				{
					name: 'PUT'
				},
				{
					name: 'DELETE'
				},	
			]);
			this.options.initialValue = this.collection.at(0);

			// convert initial value string to object
			//
			if (this.options.initialValue && typeof(this.options.initialValue) == 'string') {
				this.options.initialValue = new Backbone.Model({
					name: this.options.initialValue
				});
			}

			// call superclass method
			//
			NameSelectorView.prototype.initialize.call(this, this.options);
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				selected: this.selected? this.selected.get('name') : undefined
			}));
		},

		//
		// query methods
		//

		getSelectedName: function() {
			var selected = this.getSelected();
			if (selected) {
				return selected.get('name')
			} else {
				return 'any type';
			}
		}
	});
});
