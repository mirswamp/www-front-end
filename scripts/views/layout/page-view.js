/******************************************************************************\
|                                                                              |
|                                    page-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the main single column page container view.              |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'text!templates/layout/page.tpl',
	'views/base-view',
	'views/layout/header-view',
	'views/layout/footer-view'
], function($, _, Template, BaseView, HeaderView, FooterView) {
	
	// pre-compile template
	//
	var _template = _.template(Template);

	return BaseView.extend({

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
			this.showChildView('header', new HeaderView({
				nav: this.options.nav || "home"
			}));

			// show content view
			//
			this.showChildView('content', this.options.contentView);

			// show footer view
			//
			this.showChildView('footer', new FooterView());
		},

		//
		// event handling methods
		//

		onKeyDown: function(event) {
			if (this.getChildView('content').onKeyDown) {

				// let view handle event
				//
				this.getChildView('content').onKeyDown(event);

			// if return key is pressed, then trigger primary button
			//
			} else if (event.keyCode == 13 && $('button:focus').length == 0) {
				var button;

				// find primary button
				//
				if (this.hasChildView('content')) {
					button = this.getChildView('content').$el.find('.btn-primary')[0];
				}
				if (!button && this.hasChildView('header')) {
					button = this.getChildView('header').$el.find('.btn-primary')[0];
				}

				if (button) {

					// activate button
					//
					$(button).trigger('click');

					// prevent further handling of event
					//
					event.stopPropagation();
					event.preventDefault();		
				}
			}
		}
	});
});
