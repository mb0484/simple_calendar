let calendar = new Calendar();

window.onload = function() {
    console.log("loaded")

    constructCalendar();
};

function putInNextMonth() {
    calendar.nextMonth();
    constructCalendar();
}

function putInPrevMonth() {
    calendar.prevMonth();
    constructCalendar();
}

function constructCalendar() {
    let curNumDays = calendar.numDaysInMonth();
    var curRow = 0;
    let curDayIdx = undefined;
    let day = undefined;

    // change days for current month
    for (day = 1; day <= curNumDays; ++day) {
        // 0 - sunday, ..., 6 - saturday
        curDayIdx = calendar.getDayName(day)

        if (day != 1 && curDayIdx == 1) {
            curRow += 1;
        }

        fillDay(curDayIdx, curRow, day);
    }

    day = 1;
    // change days for next month days still seen on the calendar
    // when we set sunday for last (5th) row in last iteration, we finish
    while (curRow != 5 || curDayIdx != 0) {
        // 0 - sunday, ..., 6 - saturday
        curDayIdx = calendar.curMonth < 11 ? calendar.getDayName(day, calendar.curMonth + 1) : calendar.getDayName(day, 0, calendar.curYear + 1);

        if (curDayIdx == 1) {
            curRow += 1;
        }

        fillDay(curDayIdx, curRow, day);

        day += 1;
    }

    day = calendar.curMonth > 0 ? calendar.numDaysInMonth(calendar.curMonth - 1) : calendar.numDaysInMonth(11, calendar.curYear - 1);

    // cur day index is equal to the day index of first day of current month - 1
    for (curDayIdx = calendar.getDayName(1) - 1; curDayIdx >= 0; curDayIdx -= 1) {
        // we will always fill just 1st row
        fillDay(curDayIdx, 0, day);

        day -= 1;
    }

    $('#calendar_month').html(calendar.getMonthName());
}

// col - 0 sunday, ..., 6 saturday
// row - there are 6 rows on calendar
function fillDay(col, row, day) {
    var calendarDayString = "#row_" + (row + 1) + "_";

    switch (col) {
        case 0: calendarDayString += "sun";
                break;
        case 1: calendarDayString += "mon";
                break;
        case 2: calendarDayString += "tue";
                break;
        case 3: calendarDayString += "wed";
                break;
        case 4: calendarDayString += "thu";
                break;
        case 5: calendarDayString += "fri";
                break; 
        case 6: calendarDayString += "sat";
                break;
        default: return; 
    }

    $(calendarDayString).html(day);
}