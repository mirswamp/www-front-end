/******************************************************************************\
|                                                                              |
|                                 date-utils.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains minor general purpose date formatting utilities.        |
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
	'moment',
	'utilities/time/time-utils',
	'utilities/time/date-format',
	'library/moment/moment-timezone-with-data'
], function(Moment) {

	//
	// add functions to global scope
	//

	window.UTCDateToLocalDate = function(date) {
		if (!date) {
			return;
		}

		// parse date if necessary
		//
		if (typeof date == 'string') {
			date = Date.parseIso8601(date.replace(/-/g, '/'));
		} else if (date.date) {
			date = Date.parseIso8601(date.date.replace(/-/g, '/'));
		}

		return new Date(
			date.getTime() - 
			(new Date()).getTimezoneOffset() * 60 * 1000
		);
	}

	window.localDateToUTCDate = function(date) {
		if (!date) {
			return;
		}

		// parse date if necessary
		//
		if (typeof date == 'string') {
			date = Date.parseIso8601(date.replace(/-/g, '/'))
		} else if (date.date) {
			date = Date.parseIso8601(date.date.replace(/-/g, '/'));
		}

		return new Date(
			date.getTime() + 
			(new Date()).getTimezoneOffset() * 60 * 1000
		);
	}

	window.UTCLocalTimeOfDay = function(timeOfDay) {
		if (!timeOfDay) {
			return;
		}
		var time = timeToObject(timeOfDay);

		// get time zone offset
		//
		var timeZoneOffsetMinutes = new Date().getTimezoneOffset();
		var timeZoneOffsetHours = Math.floor(timeZoneOffsetMinutes / 60);
		timeZoneOffsetMinutes -= timeZoneOffsetHours * 60;

		// add time zone offset
		//
		time.hours -= timeZoneOffsetHours;
		time.minutes -= timeZoneOffsetMinutes;
		if (time.hours > 24) {
			time.hours -= 24;
		}

		return time;
	}

	window.UTCTimeOfDayToLocalDate = function(timeOfDay) {
		if (!timeOfDay) {
			return;
		}
		var time = UTCLocalTimeOfDay(timeOfDay);

		var date = new Date();
		date.setHours(time.hours);
		date.setMinutes(time.minutes);
		date.setSeconds(time.seconds);
		return date;
	}

	window.UTCToLocalTimeOfDay = function(timeOfDay) {
		if (!timeOfDay) {
			return;
		}
		var time_date = UTCTimeOfDayToLocalDate(timeOfDay);
		return dateFormat(time_date, "HH:MM");
	}

	window.UTCToLocalTimeOfDayMeridian = function(timeOfDay) {
		if (!timeOfDay) {
			return;
		}
		var time_date = UTCTimeOfDayToLocalDate(timeOfDay);
		return dateFormat(time_date, "h:MM TT");
	}

	//
	// HTML date formatting methods
	//

	window.dateToHTML = function(date) {
		if (!date) {
			return;
		}

		// parse date, if necessary
		//
		if (typeof date == 'string') {
			date = Date.parseIso8601(date.replace(/-/g, '/'));
		} else if (date.date) {
			date = Date.parseIso8601(date.date.replace(/-/g, '/'));
		}

		// create formatted HTML
		//
		var html = '<div class="date">';
		var timezone = Moment.tz(Moment.tz.guess()).format('z');
		html += UTCDateToLocalDate(date).format('mm/dd/yyyy');
		html += ' ' + timezone;
		html += '</div>';
		return html;	
	}

	window.datetimeToHTML = function(date) {
		if (!date) {
			return;
		}

		// parse date, if necessary
		//
		if (typeof date == 'string') {
			date = Date.parseIso8601(date.replace(/-/g, '/'));
		} else if (date.date) {
			date = Date.parseIso8601(date.date.replace(/-/g, '/'));
		}

		// create formatted HTML
		//
		var html = '<div class="datetime">';

		// add date
		//
		html += '<div class="date">';
		html += UTCDateToLocalDate(date).format('mm/dd/yyyy');
		html += '</div>';

		// add time
		//
		html += '<div class="time">';
		var timezone = Moment.tz(Moment.tz.guess()).format('z');
		html += UTCDateToLocalDate(date).format('HH:MM:ss');
		html += ' ' + timezone;
		html += '</div>';

		html += '</div>';	
		return html;
	}

	window.dateToSortableHTML = function(date) {
		if (!date) {
			return;
		}

		// parse date, if necessary
		//
		if (typeof date == 'string') {
			date = Date.parseIso8601(date.replace(/-/g, '/'));
		} else if (date.date) {
			date = Date.parseIso8601(date.date.replace(/-/g, '/'));
		}

		// create formatted HTML
		//
		var html = '<div class="datetime">';
		var timezone = Moment.tz(Moment.tz.guess()).format('z');
		var date = UTCDateToLocalDate(date);
		html += date? date.format('mm/dd/yyyy HH:MM') : '';
		html += ' ' + timezone;
		html += '</div>';
		
		return html;
	}
});
