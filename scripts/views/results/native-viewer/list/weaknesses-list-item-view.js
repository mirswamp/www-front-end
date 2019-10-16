/******************************************************************************\
|                                                                              |
|                         weaknesses-list-item-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for displaying a single weakness.                 |
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
	'bootstrap/popover',
	'text!templates/results/native-viewer/list/weaknesses-list-item.tpl',
	'views/collections/tables/table-list-item-view',
	'utilities/web/html-utils',
	'utilities/web/query-strings'
], function($, _, Popover, Template, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'mousedown': 'onMouseDown',
			'mousedown .popover':  'onMouseDownPopover',
			'click a.suggestion, .suggestion a': 'onClickSuggestionLink'
		},

		getBugLocationIndex: function(BugLocations) {
			for (var i = 0; i < BugLocations.length; i++) {
				if (BugLocations[i].primary) {
					return i;
				}
			}
			return 0;
		},

		getQueryString: function() {
			return ('bugindex=' + (this.model.get('BugId') - 1)) +
				(this.options.filter_type == 'include'? '&' + arrayToQueryString('include', this.options.filter) : '') +
				(this.options.filter_type == 'exclude'? '&' + arrayToQueryString('exclude', this.options.filter) : '');
		},

		getUrl: function() {
			return application.getURL() + 
				'#results/' + this.options.parent.options.results.get('assessment_result_uuid') + 
				'/projects/' + this.options.parent.options.projectUuid +
				'/source';
		},

		//
		// rendering methods
		//

		templateContext: function() {
			var bugLocations = this.model.get('BugLocations');
			var index = this.getBugLocationIndex(bugLocations);
			var bugLocation = bugLocations? bugLocations[index] : undefined;
			var filename = bugLocation? bugLocation.SourceFile : '';

			// strip artificial dereference from file path
			//
			if (filename.startsWith('pkg1/')) {
				filename = filename.replace('pkg1/', '');
			}

			return {
				model: this.model,
				index: this.options.index + 1,
				showNumbering: this.options.showNumbering,
				filename: filename,
				url: this.getUrl(),
				queryString: this.getQueryString(),
				bugLocation: bugLocation
			};
		},

		onRender: function() {
			this.addTooltips();
			this.addPopovers();
		},

		addTooltips: function() {

			// show tooltips on hover
			//
			this.$el.find('[data-toggle="tooltip"]').tooltip({
				trigger: 'hover'
			});
		},

		addPopovers: function() {

			// show popovers on click
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'click'
			});
		},

		//
		// event handling methods
		//

		onMouseDown: function() {
			this.options.parent.$el.find('.popover').remove();
		},

		onMouseDownPopover: function(event) {
			event.stopPropagation();
		},

		onClickSuggestionLink: function(event) {
			event.preventDefault();
			event.stopPropagation();
		}
	});
});
