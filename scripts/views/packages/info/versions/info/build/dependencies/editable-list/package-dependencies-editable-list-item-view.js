/******************************************************************************\
|                                                                              |
|                 package-dependencies-editable-list-item-view.js              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable list view of a package's dependencies        |
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
	'bootstrap/popover',
	'text!templates/packages/info/versions/info/build/dependencies/editable-list/package-dependencies-editable-list-item.tpl',
	'views/collections/tables/table-list-item-view'
], function($, _, Popover, Template, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'change .dependency-list input': 'onChangeDependencyListInput',
			'click .delete button': 'onClickDelete'
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				platformVersionName: this.options.platformVersion? this.options.platformVersion.get('full_name') : '?',
				platformVersionString: this.options.platformVersion? this.options.platformVersion.get('version_string') : '?',
				platformUrl: undefined,
				platformVersionUrl: application.getURL() + '#platforms/versions/' + this.model.get('platform_version_uuid'),
				dependencyList: this.model.get('dependency_list'),
				showDelete: this.options.showDelete
			};
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});
		},

		//
		// event handling methods
		//

		onChangeDependencyListInput: function() {
			var dependencyList = this.$el.find('.dependency-list input').val();
			
			// remove commas
			//
			dependencyList = dependencyList.replace(/,/g,'');

			// update form
			//
			this.$el.find('.dependency-list input').val(dependencyList);

			// save
			//
			this.model.set({
				'dependency_list': dependencyList
			});
		},

		onClickDelete: function() {
			var self = this;

			// add to list of deleted items
			//
			if (this.options.parent.options.deletedItems) {
				this.options.parent.options.deletedItems.add(this.model);
			}

			// remove from collection
			//
			this.options.parent.collection.remove(this.model);

			// perform change callback
			//
			this.options.parent.onChange();
		}
	});
});