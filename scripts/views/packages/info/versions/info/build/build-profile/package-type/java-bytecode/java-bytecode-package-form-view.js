/******************************************************************************\
|                                                                              |
|                      java-bytecode-package-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form for entering a package versions's                 |
|        language / type specific profile info.                                |
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
	'text!templates/packages/info/versions/info/build/build-profile/package-type/java-bytecode/java-bytecode-package-form.tpl',
	'widgets/accordions',
	'models/files/directory',
	'views/packages/info/versions/info/build/build-profile/package-type/package-type-form-view',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-item-dialog-view'
], function($, _, Template, Accordions, Directory, PackageTypeFormView, SelectPackageVersionItemDialogView) {
	return PackageTypeFormView.extend({
		
		//
		// attributes
		//
		
		template: _.template(Template),

		events: {
			'click #add-class-path': 'onClickAddClassPath',
			'click #add-aux-class-path': 'onClickAddAuxClassPath',
			'click #add-source-path': 'onClickAddSourcePath'
		},

		//
		// querying methods
		//

		getBuildSystem: function() {
			return 'java-bytecode';
		},

		//
		// rendering methods
		//

		templateContext: function() {
			return {
				model: this.model
			};
		},

		onRender: function() {

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));

			// call superclass method
			//
			PackageTypeFormView.prototype.onRender.call(this);
		},
		
		//
		// form methods
		//

		getValues: function() {

			// set model attributes
			//
			return {

				// java bytecode attributes
				//
				'bytecode_class_path': this.$el.find('#class-path:visible').val(),
				'bytecode_aux_class_path': this.$el.find('#aux-class-path:visible').val(),
				'bytecode_source_path': this.$el.find('#source-path:visible').val(),

				// build system attributes
				//
				'build_system': 'java-bytecode',
				'build_cmd': null,

				// configuration attributes
				//
				'config_dir': null,
				'config_cmd': null,
				'config_opt': null,

				// build attributes
				//
				'build_dir': null,
				'build_file': null,
				'build_opt': null,
				'build_target': null
			};
		},

		//
		// event handling methods
		//

		onClickAddClassPath: function(event) {
			var self = this;

			// show select package version item dialog
			//
			application.show(new SelectPackageVersionItemDialogView({
				model: this.model,
				title: "Add Class Path",
				
				// callbacks
				//
				accept: function(selectedItemName) {
					if (selectedItemName) {

						// make path relative to package path
						//
						var directory = new Directory({
							name: self.model.get('source_path')
						});
						selectedItemName = directory.getRelativePathTo(selectedItemName);

						// paths are colon separated
						//
						var textArea = self.$el.find('#class-path');
						if (textArea.val() != '') {
							textArea.val(textArea.val() + ':');
						}

						// append path
						//
						textArea.val(textArea.val() + selectedItemName);
						self.options.parent.onChange();
					}
				}
			}), {
				size: 'large'
			});

			// prevent further handling of event
			//
			event.stopPropagation();
			event.preventDefault();
		},

		onClickAddAuxClassPath: function(event) {
			var self = this;

			// show select package version item dialog
			//
			application.show(new SelectPackageVersionItemDialogView({
				model: this.model,
				title: "Add Aux Class Path",
				
				// callbacks
				//
				accept: function(selectedItemName) {
					if (selectedItemName) {

						// make path relative to package path
						//
						var directory = new Directory({
							name: self.model.get('source_path')
						});
						selectedItemName = directory.getRelativePathTo(selectedItemName);

						// paths are colon separated
						//
						var textArea = self.$el.find('#aux-class-path');
						if (textArea.val() != '') {
							textArea.val(textArea.val() + ':');
						}

						// append path
						//
						textArea.val(textArea.val() + selectedItemName);
						self.options.parent.onChange();
					}
				}
			}), {
				size: 'large'
			});

			// prevent further handling of event
			//
			event.stopPropagation();
			event.preventDefault();
		},
		
		onClickAddSourcePath: function(event) {
			var self = this;

			// show select package version item dialog
			//
			application.show(new SelectPackageVersionItemDialogView({
				model: this.model,
				title: "Add Source Path",
				
				// callbacks
				//
				accept: function(selectedItemName) {
					if (selectedItemName) {

						// make path relative to package path
						//
						var directory = new Directory({
							name: self.model.get('source_path')
						});
						selectedItemName = directory.getRelativePathTo(selectedItemName);

						// paths are colon separated
						//
						var textArea = self.$el.find('#source-path');
						if (textArea.val() != '') {
							textArea.val(textArea.val() + ':');
						}

						// append path
						//
						textArea.val(textArea.val() + selectedItemName);
						self.options.parent.onChange();
					}
				}
			}), {
				size: 'large'
			});

			// prevent further handling of event
			//
			event.stopPropagation();
			event.preventDefault();
		}
	});
});
