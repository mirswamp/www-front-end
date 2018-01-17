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
	'utilities/time/time-utils',
	'utilities/time/date-format'
], function() {

	//
	// add functions to global scope
	//

	window.UTCDateToLocalDate = function(date) {
		if (!date) {
			return;
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
		var html = '<div class="date">';
		if (date) {
			html += UTCDateToLocalDate(date).format('mm/dd/yyyy');
		}
		html += '</div>';
		return html;	
	}

	window.dateToDetailedHTML = function(date) {
		var html = '<div class="datetime">';

		// add date
		//
		html += '<div class="date">';
		if (date) {
			html += UTCDateToLocalDate(date).format('mm/dd/yyyy');
		}
		html += '</div>';

		// add time
		//
		html += '<div class="time">';
		if (date) {
			html += UTCDateToLocalDate(date).format('HH:MM:ss');
		}
		html += '</div>';

		html += '</div>';	
		return html;
	}

	window.dateToSortableHTML = function(date) {

		// add non-displayable sorting datetime
		//
		var html = '<div class="datetime">';
		if (date) {
			html += UTCDateToLocalDate(date).format('mm/dd/yyyy HH:MM');
		}
		html += '</div>';
		
		return html;
	}
});