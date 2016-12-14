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
|        Copyright (C) 2012-2016 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

function UTCDateToLocalDate(date) {
	if (!date) {
		return;
	}
	return new Date(
		date.getTime() - 
		(new Date()).getTimezoneOffset() * 60 * 1000
	);
}

function LocalDateToUTCDate(date) {
	if (!date) {
		return;
	}
	return new Date(
		date.getTime() + 
		(new Date()).getTimezoneOffset() * 60 * 1000
	);
}

function UTCLocalTimeOfDay(timeOfDay) {
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

function UTCTimeOfDayToLocalDate(timeOfDay) {
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

function UTCToLocalTimeOfDay(timeOfDay) {
	if (!timeOfDay) {
		return;
	}
	var time_date = UTCTimeOfDayToLocalDate(timeOfDay);
	return dateFormat(time_date, "HH:MM");
}

function UTCToLocalTimeOfDayMeridian(timeOfDay) {
	if (!timeOfDay) {
		return;
	}
	var time_date = UTCTimeOfDayToLocalDate(timeOfDay);
	return dateFormat(time_date, "h:MM TT");
}

//
// HTML date formatting methods
//

function dateToHTML(date) {
	var html = '<div class="date">';
	if (date) {
		html += UTCDateToLocalDate(date).format('mm/dd/yyyy');
	}
	html += '</div>';
	return html;	
}

function dateToDetailedHTML(date) {
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

function dateToSortableHTML(date) {

	// add non-displayable sorting datetime
	//
	var html = '<div class="datetime">';
	if (date) {
		html += UTCDateToLocalDate(date).format('mm/dd/yyyy HH:MM');
	}
	html += '</div>';
	
	return html;
}