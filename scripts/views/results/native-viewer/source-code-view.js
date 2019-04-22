/******************************************************************************\
|                                                                              |
|                              source-code-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the native viewer for displaying source code.            |
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
	'registry',
	'text!templates/results/native-viewer/source-code.tpl',
	'utilities/browser/html-utils',
	'ace/ace'
], function($, _, Backbone, Marionette, Registry, Template, HtmlUtils, Ace) {
	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

 		className: 'source-code',

		//
		// querying methods
		//

		getResultsUrl: function() {
			return Registry.application.getURL() + '#results/' + this.options.data.assessment_results_uuid +
				'/viewer/' + this.options.viewerUuid +
				'/project/' + this.options.projectUuid + 
				'?to=50';
		},

		getBugLocation: function(bugLocations) {
			for (var i = 0; i < bugLocations.length; i++) {
				if (bugLocations[i].primary) {
					return bugLocations[i];
				}
			}
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				results_url: this.getResultsUrl(),
				filename: stringToHTML(this.options.filename)
			}));
		},

		onRender: function() {

			// create new editor
			//
			this.editor = Ace.edit(this.$el.find('.listing')[0]);

			// set code styling
			//
			this.editor.setReadOnly(true);
			this.editor.setTheme('ace/theme/chrome');
			this.editor.setShowPrintMargin(false);

			// set code
			//
			this.editor.session.setValue(this.options.source);
			this.editor.getSession().setMode('ace/mode/' + 'c_cpp');
			
			// set code selection
			//
			// this.editor.clearSelection();
			// this.editor.selection.moveCursorFileStart();
			this.editor.focus();

			// show code weaknesses
			//
			this.showBugs(this.options.bugInstances);
		},

		onShow: function() {

			// go to current bug location
			//
			if (this.options.bugInstance) {
				var bugLocation = this.getBugLocation(this.options.bugInstance.BugLocations);
				var lineNumber = bugLocation.StartLine;
				this.editor.resize(true);
				this.editor.scrollToLine(lineNumber, true, true);
				this.editor.gotoLine(lineNumber);
			}
		},

		showBugs: function(bugInstances) {
			var annotations = [];

			for (var i = 0; i < bugInstances.length; i++) {
				var bugInstance = bugInstances[i];

				annotations.push({
					row: bugInstance.BugLocation.StartLine - 1,
					column: bugInstance.BugLocation.StartColumn,
					text: bugInstance.BugCode + ':\n' + '\n' + bugInstance.BugMessage,
					type: 'error'
				});
			}

			this.editor.getSession().setAnnotations(annotations);
		}
	});
});