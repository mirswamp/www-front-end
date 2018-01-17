/******************************************************************************\
|                                                                              |
|                         java-bytecode-package-form-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a package versions's            |
|        language / type specific profile information.                         |
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
	'marionette',
	'bootstrap/collapse',
	'jquery.validate',
	'bootstrap/tooltip',
	'bootstrap/popover',
	'text!templates/packages/info/versions/info/build/build-profile/package-type/java-bytecode/java-bytecode-package-form.tpl',
	'registry',
	'widgets/accordions',
	'models/files/directory',
	'views/packages/info/versions/info/build/build-profile/dialogs/select-package-version-item-view'
], function($, _, Backbone, Marionette, Collapse, Validate, Tooltip, Popover, Template, Registry, Accordions, Directory, SelectPackageVersionItemView) {
	return Backbone.Marionette.ItemView.extend({
		
		//
		// attributes
		//
		
		events: {
			'click #add-class-path': 'onClickAddClassPath',
			'click #add-aux-class-path': 'onClickAddAuxClassPath',
			'click #add-source-path': 'onClickAddSourcePath'
		},

		//
		// rendering methods
		//

		template: function(data) {
			return _.template(Template, _.extend(data, {
				model: this.model
			}));
		},

		onRender: function() {

			// display popovers on hover
			//
			this.$el.find('[data-toggle="popover"]').popover({
				trigger: 'hover'
			});

			// change accordion icon
			//
			new Accordions(this.$el.find('.panel'));

			// validate the form
			//
			this.validator = this.validate();
		},

		//
		// form validation methods
		//

		validate: function() {
			return this.$el.find('form').validate();
		},

		isValid: function() {
			return this.validator.form();
		},

		//
		// form methods
		//

		update: function(model) {

			// paths
			//
			var classPath = this.$el.find('#class-path').val();
			var auxClassPath = this.$el.find('#aux-class-path').val();
			var sourcePath = this.$el.find('#source-path').val();

			// set model attributes
			//
			model.set({

				// java bytecode attributes
				//
				'bytecode_class_path': classPath != ''? classPath : null,
				'bytecode_aux_class_path': auxClassPath != ''? auxClassPath : null,
				'bytecode_source_path': sourcePath != ''? sourcePath : null,

				// build system attributes
				//
				'build_system': null,
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
			});
		},

		//
		// event handling methods
		//

		onClickAddClassPath: function(event) {
			var self = this;

			// show select package version item dialog
			//
			Registry.application.modal.show(
				new SelectPackageVersionItemView({
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
				}
			);

			// prevent event defaults
			//
			event.stopPropagation();
			event.preventDefault();
		},

		onClickAddAuxClassPath: function(event) {
			var self = this;

			// show select package version item dialog
			//
			Registry.application.modal.show(
				new SelectPackageVersionItemView({
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
				}
			);

			// prevent event defaults
			//
			event.stopPropagation();
			event.preventDefault();
		},
		
		onClickAddSourcePath: function(event) {
			var self = this;

			// show select package version item dialog
			//
			Registry.application.modal.show(
				new SelectPackageVersionItemView({
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
				}
			);

			// prevent event defaults
			//
			event.stopPropagation();
			event.preventDefault();
		}
	});
});
