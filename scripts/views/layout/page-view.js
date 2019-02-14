/******************************************************************************\
|                                                                              |
|                                    page-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the main single column page container view.              |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2019 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/layout/page.tpl',
	'views/layout/header-view',
	'views/layout/footer-view'
], function($, _, Backbone, Marionette, Template, HeaderView, FooterView) {
	
	// pre-compile template
	//
	var _template = _.template(Template);

	return Backbone.Marionette.LayoutView.extend({

		//
		// attributes
		//

		template: _template,
		id: 'page',

		regions: {
			header: '#header',
			content: '#content',
			footer: '#footer'
		},

		//
		// constructor
		//

		initialize: function() {

			// set content view parent
			//
			this.options.contentView.options.parent = this;
		},

		//
		// rendering methods
		//

		onRender: function() {

			// show header view
			//
			this.header.show(new HeaderView({
				nav: this.options.nav || "home"
			}));

			// show content view
			//
			this.content.show(
				this.options.contentView
			);

			// show footer view
			//
			this.footer.show(
				new FooterView()
			);
		},

		//
		// event handling methods
		//

		onKeyDown: function(event) {
			if (this.content.currentView.onKeyDown) {

				// let view handle event
				//
				this.content.currentView.onKeyDown(event);

			// if return key is pressed, then trigger primary button
			//
			} else if (event.keyCode == 13) {
				if (this.content.currentView && this.content.currentView.$el.find('.btn-primary').length > 0) {

					// let content handle event
					//
					this.content.currentView.$el.find('.btn-primary').trigger('click');

					// finish handling event
					//
					event.stopPropagation();
					event.preventDefault();
				} else if (this.header.currentView && this.header.currentView.$el.find('.btn-primary').length > 0) {
					
					// let header handle event
					//
					this.header.currentView.$el.find('.btn-primary').trigger('click');

					// finish handling event
					//
					event.stopPropagation();
					event.preventDefault();
				}
			}
		}
	});
});
