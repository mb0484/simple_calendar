let calendar = new Calendar();
let curFocusedDayId = undefined;
let todayDayId = undefined;

const FILE_URL = 'events.txt';

window.onload = function() {
    // initialization
    $('#calendar_month_select').selectpicker('render');

    // load calendar events
    fetch(FILE_URL)
        .then(response => response.text())
        .then(text => fillCalendarWithEvents(text, constructCalendar))

    constructCalendar();
};

function fillCalendarWithEvents(eventData, callback = undefined) {
    for (let row of eventData.split("\n")) {
        // Get event date
        let day = row.split(";")[0].split(" ")[0];
        let month = row.split(";")[0].split(" ")[1] - 1;
        let year = row.split(";")[0].split(" ")[2];

        // Get event description
        let description = row.split(";")[1];

        // Is looped event
        let isLoopedEvent = row.split(";")[2] === "loop";

        calendar.addEvent(new CalendarEvent(day, month, year, description, isLoopedEvent));
    }

    callback && callback();
}

function putInNextMonth() {
    calendar.nextMonth();
    constructCalendar();
}

function putInPrevMonth() {
    calendar.prevMonth();
    constructCalendar();
}

function changeCurDate() {
    let day = parseInt($("#day_input").val());
    let month = parseInt($("#calendar_month_select").val());
    let year = parseInt($("#year_input").val());

    // In our application months are 0 indexed so we have to add 1
    let curDate = new Date(year + "/" + (month + 1) + "/" + day);

    if (curDate.toString() !== "Invalid Date") {
        calendar.curDay = day;
        calendar.curMonth = month;
        calendar.curYear = year

        // if we set curFocusedDayId to undefined, we want to firsty unfocus from previously focused day
        unfocusFromDay();
        // we make it undefined, so calendar will focus on newly provided date
        curFocusedDayId = undefined;

        constructCalendar();
    }
}

function focusOnDay(dayId) {
    // check whetrher user clicked on previous month day
    if ($('#' + dayId).hasClass("prev_month")) {
        calendar.prevMonth();
    }
    // check whetrher user clicked on next month day
    else if ($('#' + dayId).hasClass("next_month")) {
        calendar.nextMonth();
    }
    calendar.curDay = parseInt($('#' + dayId).html());

    // change current focused day fields
    $('#calendar_date').html(calendar.curDay + ". " + calendar.getMonthName() + " " + calendar.curYear);
    $('#calendar_day').html(getDayName(dayId));

    unfocusFromDay();
    $('#' + dayId).addClass("cur_viewed_day");
    curFocusedDayId = dayId;

    // generate events for marked day
    $("#events").html("");

    let eventsText = "";
    for (let e of calendar.getEvents()) {
        eventsText += e.generateEventHtml();
    }

    // we have to put calendar back
    if ($('#' + dayId).hasClass("prev_month")) {
        calendar.nextMonth();
    }
    else if ($('#' + dayId).hasClass("next_month")) {
        calendar.prevMonth();
    }

    $("#events").html(eventsText);
}

function markTodaysDay(day, curDayIdx, curRow) {
    if (calendar.isTodaysDate(day)) {
        todayDayId = constructDayId(curDayIdx, curRow, day);
        $('#' + todayDayId).addClass("todays_day");
    }
}

function unfocusFromDay() {
    curFocusedDayId && $('#' + curFocusedDayId).removeClass("cur_viewed_day");
}

function unfocusFromTodaysDay() {
    todayDayId && $('#' + todayDayId).removeClass("todays_day");
}

function constructCalendar() {
    let curNumDays = calendar.numDaysInMonth();
    var curRow = 0;
    let curDayIdx = undefined;
    let day = undefined;
    // when constructing new calendar, we want to unfocus from certain day
    unfocusFromDay();
    unfocusFromTodaysDay();

    // change days for current month
    for (day = 1; day <= curNumDays; ++day) {
        // 0 - sunday, ..., 6 - saturday
        curDayIdx = calendar.getDayIndex(day)

        if (day != 1 && curDayIdx == 1) {
            curRow += 1;
        }

        if (calendar.getEvents(day, calendar.curMonth, calendar.curYear).length > 0) {
            fillDay(curDayIdx, curRow, day, "event");
        } else {
            fillDay(curDayIdx, curRow, day);
        }

        if (curFocusedDayId === undefined && day === calendar.curDay) {
            curFocusedDayId = constructDayId(curDayIdx, curRow, day);
            focusOnDay(curFocusedDayId);
        }

        markTodaysDay(day, curDayIdx, curRow);
    }

    // we put calendar in next month and then change it back
    calendar.nextMonth();
    day = 1;
    // change days for next month days still seen on the calendar
    // when we set sunday (0th) for last (5th) row in last iteration, we finish
    while (curRow != 5 || curDayIdx != 0) {
        // 0 - sunday, ..., 6 - saturday
        curDayIdx = calendar.getDayIndex(day, calendar.curMonth);

        if (curDayIdx == 1) {
            curRow += 1;
        }

        if (calendar.getEvents(day, calendar.curMonth, calendar.curYear).length > 0) {
            fillDay(curDayIdx, curRow, day, "next_month event");
        } else {
            fillDay(curDayIdx, curRow, day, "next_month");
        }

        markTodaysDay(day, curDayIdx, curRow);

        day += 1;
    }
    // we change it back
    calendar.prevMonth();

    // previous month day index is equal to the day index of first day of current month - 1
    curDayIdx = calendar.getDayIndex(1) - 1;
    // if we started current month with sunday (0), we have to fill all other days in week, indexes for these days are greater than zero and begin with saturday (6)
    curDayIdx = curDayIdx == -1 ? 6 : curDayIdx;

    // we put calendar in previous month and then change it back
    calendar.prevMonth();

    // change days for previous month days still seen on the calendar
    day = calendar.numDaysInMonth(calendar.curMonth);

    for (curDayIdx; curDayIdx > 0; curDayIdx -= 1) {
        if (calendar.getEvents(day, calendar.curMonth, calendar.curYear).length > 0) {
            // we will always fill just 1st row (0)
            fillDay(curDayIdx, 0, day, "prev_month event");
        } else {
            // we will always fill just 1st row (0)
            fillDay(curDayIdx, 0, day, "prev_month");
        }

        markTodaysDay(day, curDayIdx, 0);

        day -= 1;
    }

    // we change it back
    calendar.nextMonth();

    $('#calendar_month').html(calendar.getMonthName());
}

// col - 0 sunday, ..., 6 saturday
// row - there are 6 rows on calendar
function fillDay(col, row, day, addClass = undefined) {
    $('#' + constructDayId(col, row, day)).removeClass("event");
    $('#' + constructDayId(col, row, day)).removeClass("prev_month");
    $('#' + constructDayId(col, row, day)).removeClass("next_month");
    $('#' + constructDayId(col, row, day)).html(day);
    addClass && $('#' + constructDayId(col, row, day)).addClass(addClass);
}

function constructDayId(col, row, day) {
    let calendarDayString = "row_" + (row + 1) + "_";

    switch (col) {
        case 0: return calendarDayString + "sun";
        case 1: return calendarDayString + "mon";
        case 2: return calendarDayString + "tue";
        case 3: return calendarDayString + "wed";
        case 4: return calendarDayString + "thu";
        case 5: return calendarDayString + "fri"; 
        case 6: return calendarDayString + "sat";
        default: return ""; 
    }
}

function getDayName(dayId) {
    switch (dayId.split("_")[2]) {
        case "sun": return "Sunday";
        case "mon": return "Monday";
        case "tue": return "Tuesday";
        case "wed": return "Wednesday";
        case "thu": return "Thursday";
        case "fri": return "Friday";
        case "sat": return "Saturday";
    }
}