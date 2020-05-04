Date.parseIso8601 = function(currentDate) {

    // Check the input parameters
    //
    if (typeof currentDate != "string" || currentDate == "") {
        return null;
    }

    // Set the fragment expressions
    //
    var string = "[\\-/:.]";
    var year = "((?:1[6-9]|[2-9][0-9])[0-9]{2})";
    var month = string + "((?:1[012])|(?:0[1-9])|[1-9])";
    var day = string + "((?:3[01])|(?:[12][0-9])|(?:0[1-9])|[1-9])";
    var hour = "(2[0-4]|[01]?[0-9])";
    var minute = string + "([0-5]?[0-9])";
    var second = "(?:" + string + "([0-5]?[0-9])(?:[.,]([0-9]+))?)?";
    var timeZone = "(?:(Z)|(?:([\+\-])(1[012]|[0]?[0-9])(?::?([0-5]?[0-9]))?))?";

    // RegEx the input
    // First check: Just date parts (month and day are optional)
    // Second check: Full date plus time (seconds, milliseconds and TimeZone info are optional)
    //
    var fragments = new RegExp("^" + year + "(?:" + month + "(?:" + day + ")?)?" + "$").exec(currentDate);
    if (!fragments) {
        fragments = new RegExp("^" + year + month + day + "[Tt ]" + hour + minute + second + timeZone + "$").exec(currentDate);
    }

    // If the date couldn't be parsed, return null
    //
    if (!fragments) {
        return null;
    }

    // Default the time fragments if they're not present
    //
    if (!fragments[2]) {
        fragments[2] = 1;
    } else {
        fragments[2] = fragments[2] - 1;
    }
    if (!fragments[3]) {
        fragments[3] = 1;
    }
    if (!fragments[4]) {
        fragments[4] = 0;
    }
    if (!fragments[5]) {
        fragments[5] = 0;
    }
    if (!fragments[6]) {
        fragments[6] = 0;
    }
    if (!fragments[7]) {
        fragments[7] = 0;
    }
    if (!fragments[8]) {
        fragments[8] = null;
    }
    if (fragments[9] != "-" && fragments[9] != "+" ) {
        fragments[9] = null;
    }
    if (!fragments[10]) {
        fragments[10] = 0;
    } else { 
        fragments[10] = fragments[9] + fragments[10];
    }
    if (!fragments[11]) {
        fragments[11] = 0;
    } else {
        fragments[11] = fragments[9] + fragments[11];
    }

    // If there's no timezone info the data is local time
    //
    if (!fragments[8] && !fragments[9]) {
        return new Date(fragments[1], fragments[2], fragments[3], fragments[4], fragments[5], fragments[6], fragments[7]);
    }

    // If the UTC indicator is set the date is UTC
    //
    if (fragments[8] == "Z") {
        return new Date(Date.UTC(fragments[1], fragments[2], fragments[3], fragments[4], fragments[5], fragments[6], fragments[7]));
    }
    
    // If the date has a time zone offset
    //
    if (fragments[9] == "-" || fragments[9] == "+") {

        // Get current time zone information
        //
        var timezoneOffset = new Date().getTimezoneOffset();
        var currentHours = fragments[10] - ((timezoneOffset >= 0 ? "-" : "+") + Math.floor(Math.abs(timezoneOffset) / 60));
        var currentMinutes = fragments[11] - ((timezoneOffset >= 0 ? "-" : "+") + (Math.abs(timezoneOffset) % 60));

        // Return the date
        //
        return new Date(fragments[1], fragments[2], fragments[3], fragments[4] - currentHours, fragments[5] - currentMinutes, fragments[6], fragments[7]);
    }

    // If we've reached here we couldn't deal with the input, return null
    //
    return null;
};