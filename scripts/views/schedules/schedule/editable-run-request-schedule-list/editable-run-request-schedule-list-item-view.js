/******************************************************************************\
|                                                                              |
|                   editable-run-request-schedule-item-view.js                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for showing a single run request schedule         |
|        list item.                                                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2020 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

define([
	'jquery',
	'underscore',
	'bootstrap.timepicker',
	'modernizr',
	'jquery.validate',
	'text!templates/schedules/schedule/editable-run-request-schedule-list/editable-run-request-schedule-list-item.tpl',
	'utilities/time/date-format',
	'utilities/time/date-utils',
	'models/run-requests/run-request-schedule',
	'views/collections/tables/table-list-item-view'
], function($, _, Timepicker, Modernizr, Validate, Template, DateFormat, DateUtils, RunRequestSchedule, TableListItemView) {
	return TableListItemView.extend({

		//
		// attributes
		//

		template: _.template(Template),

		events: {
			'change .type select': 'onChangeTypeSelect',
			'change select.day-of-the-week': 'onChangeSelectDayOfTheWeek',
			'input input.day-of-the-month': 'onChangeInputDayOfTheMonth',
			'input .time .time_input': 'onChangeTimeInput',
			'click .delete button': 'onClickDelete'
		},

		//
		// constructor
		//

		initialize: function() {

			// Custom validation method for class based rule
			//
			$.validator.addMethod('timeRequired', $.validator.methods.required, "Time Required");

			// add numeric only validation rule
			//
			$.validator.addMethod('dayNumber', function (value) { 
				var regex = new RegExp('^([1-9]|[12]\d|3[0-1]i|10|20|30)+$');
				return regex.test(value);
			}, 'Please only enter numeric day values (1-31)');

			// add custom rules
			//
			$.validator.addClassRules({
				'time_input': {
					timeRequired: true
				},
				'time_shim': {
					timeRequired: true
				},
				'day-of-the-month': {
					dayNumber: true
				}
			});
		},

		//
		// rendering methods
		//

		templateContext: function() {
			var timeOfDay = this.model.get('time_of_day');

			return {
				model: this.model,

				// convert time of day from UTC to local time
				//
				time_of_day: timeOfDay ? UTCToLocalTimeOfDay(timeOfDay) : dateFormat(new Date(), 'HH:MM:00'),
				time_of_day_meridian: timeOfDay ? UTCToLocalTimeOfDayMeridian(timeOfDay) : dateFormat(new Date(), 'h:MM TT'),
				showDelete: this.options.showDelete
			};
		},

		onRender: function() {
			var self = this;

			// apply select2 selector
			//
			/*
			this.$el.find('select').select2({
				dropdownAutoWidth: 'true'
			});
			*/

			if (!Modernizr.inputtypes.time) {

				// HTML5 time input shim
				//
				this.$el.find('.time .time_container').hide();
				this.$el.find('.time .time_shim').timepicker({showInputs: true, disableFocus: true, template: 'dropdown'});
				this.$el.find('.time .time_shim').timepicker().on('changeTime.timepicker', function(event) {
					var time_holder = new Date();

					var hour = event.time.meridian === 'PM' ? event.time.hours + 12 : event.time.hours;
					if (hour === 12) {
						hour = 0;
					}
					if (hour === 24) {
						hour = 12;
					}

					time_holder.setHours(hour);
					time_holder.setMinutes(event.time.minutes);
					time_holder.setSeconds(0);

					// put time into original field
					//
					var formatted_time = dateFormat( time_holder, 'HH:MM:00' );
					self.$el.find('.time .time_input').val(formatted_time);
					self.$el.find('.time .time_input').change();
					
				  });
			} else {
				this.$el.find('.time .time_shim_container').hide();
			}

			// validate form
			//
			this.validate();
		},		

		getRecurrenceType: function() {
			return this.$el.find('.type select').val();
		},

		getDayOfTheWeek: function() {
			return this.$el.find('select.day-of-the-week').val();
		},

		getDayOfTheMonth: function() {
			return this.$el.find('input.day-of-the-month').val();
		},

		getTimeOfDay: function() {
			return this.$el.find('.time .time_input').val();
		},

		//
		// form validation methods
		//

		validate: function() {
			this.validator = this.$el.find('form').validate({
				rules: this.rules,
				messages: this.messages
			});
		},

		isValid: function() {
			// return this.validator.form();
			return true;
		},

		//
		// event handling methods
		//

		onChangeTypeSelect: function() {

			// update model
			//
			this.model.set({
				'recurrence_type': this.getRecurrenceType()
			});

			// update view
			//
			this.render();

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		},

		onChangeSelectDayOfTheWeek: function() {

			// update model
			//

			this.onChangeTimeInput();	
		},

		onChangeInputDayOfTheMonth: function() {

			// update model
			//

			this.onChangeTimeInput();
		},

		onChangeTimeInput: function() {
			var tzOffset = new Date().getTimezoneOffset() * 60000;
			var val = this.getTimeOfDay();
			var date = new Date();

			if (this.getRecurrenceType() === 'weekly') {
				date.setDate((date.getDate() - date.getDay()) + (this.$el.find('select.day-of-the-week')[0].selectedIndex));
			}
			if (this.getRecurrenceType() === 'monthly') {
				date.setDate(parseInt(this.getDayOfTheMonth()) - 1);
			}
				
			date.setHours(parseInt(val.split(':')[0]));
			date.setMinutes(parseInt(val.split(':')[1]));
			date.setSeconds(0); 
			date = new Date(date.getTime() + tzOffset);

			if (date) {
				var timeOfDay;

				try {
					timeOfDay = dateFormat(date, 'HH:MM:00');
				} catch(error) {
					timeOfDay = '';
				}

				// update models
				//
				this.model.set({
					'time_of_day': timeOfDay
				});	

				if (this.getRecurrenceType() === 'weekly') {
					this.model.set({
						'recurrence_day': date.getDay()
					});
				} else if (this.getRecurrenceType() === 'monthly') {
					this.model.set({
						'recurrence_day': date.getDate()
					});
				}
			}

			// perform callback
			//
			if (this.options.onChange) {
				this.options.onChange();
			}
		},

		onClickDelete: function() {
			var self = this;

			// show confirmation
			//
			application.confirm({
				title: "Delete Schedule Item",
				message: "Are you sure that you would like to delete this " + this.model.get('recurrence_type') + " schedule item?",

				// callbacks
				//
				accept: function() {

					var runRequestSchedule = new RunRequestSchedule({
						'run_request_schedule_uuid': self.model.get('run_request_schedule_uuid')
					});

					// delete user
					//
					self.model.destroy({

						// attributes
						//
						url: runRequestSchedule.url(),

						// callbacks
						//
						error: function() {

							// show error message
							//
							application.error({
								message: "Could not delete this schedule item."
							});
						}
					});
				}
			});
		}
	});
});
