/******************************************************************************\
|                                                                              |
|                                 time-utils.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains minor general purpose time oriented utilities.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2012-2017 Software Assurance Marketplace (SWAMP)        |
\******************************************************************************/

function timeToObject(timeOfDay) {
	var strings = timeOfDay.split(':');
	return {
		hours: parseInt(strings[0], 10), 
		minutes: parseInt(strings[1], 10), 
		seconds: parseInt(strings[2], 10) 
	};
}

function UTCLocalTimeOfDay(timeOfDay) {
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

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
}

//
// HTML time formatting methods
//

function elapsedTimeToHTML(date1, date2) {
	var time1 = date1? date1.getTime(): 0;
	var time2 = date2? date2.getTime() : 0;
	var seconds = Math.abs(Math.floor((time2 - time1) / 1000));

	// constants
	//
	var secondsPerMinute = 60;
	var secondsPerHour = secondsPerMinute * 60;
	var secondsPerDay = secondsPerHour * 24;
	var secondsPerWeek = secondsPerDay * 7;
	var secondsPerYear = secondsPerWeek * 52;

	// find elapsed years
	//
	var years = Math.floor(seconds / secondsPerYear);
	seconds -= years * secondsPerYear;

	// find elapsed weeks
	//
	var weeks = Math.floor(seconds / secondsPerWeek);
	seconds -= weeks * secondsPerWeek;

	// find elapsed days
	//
	var days = Math.floor(seconds / secondsPerDay);
	seconds -= days * secondsPerDay;

	// find elapsed hours
	//
	var hours = Math.floor(seconds / secondsPerHour);
	seconds -= hours * secondsPerHour;

	// find elapsed minutes
	//
	var minutes = Math.floor(seconds / secondsPerMinute);
	seconds -= minutes * secondsPerMinute;

	// convert to HTML form
	//
	if (time2 - time1 < 0) {
		var html = '<div class="negative time">';
	} else {
		var html = '<div class="time">';
	}
	if (years > 0) {
		html += '<span class="years">' + years + '</span>';
	}
	if (weeks > 0) {
		html += '<span class="weeks">' + weeks + '</span>';
	}
	if (days > 0) {
		html += '<span class="days">' + days + '</span>';
	}
	if (hours > 0) {
		html += '<span class="hours">' + hours + '</span>';
	}
	if (minutes > 0) {
		html += '<span class="minutes">' + minutes + '</span>';
	}
	html += '<span class="seconds">' + seconds + '</span>';
	html += '</div>';

	return html;
}