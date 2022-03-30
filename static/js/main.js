let calendar = new Calendar();
let curFocusedDayId = undefined;

window.onload = function() {
    console.log("loaded")

    //initialization
    $('#calendar_month_select').selectpicker('render');

    /*$('#calendar_month_select').on('change', function() {
        calendar.curMonth = this.selectedIndex;
        constructCalendar();
    });*/

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

function changeCurDate() {
    let day = parseInt($("#day_input").val());
    let month = parseInt($("#calendar_month_select").val());
    let year = parseInt($("#year_input").val());

    let curDate = new Date(year + "-" + month + "-" + day);

    if (curDate.toString() !== "Invalid Date") {
        calendar.curDay = day;
        calendar.curMonth = month;
        calendar.curYear = year;
        // we make it undefined, so calendar will focus on newly provided date
        unfocusDay();
        curFocusedDayId = undefined;

        constructCalendar();
    }
}

function focusOnDay(dayId) {
    unfocusDay();
    $('#' + dayId).addClass("cur_viewed_day");
    curFocusedDayId = dayId;
}

function unfocusDay() {
    curFocusedDayId && $('#' + curFocusedDayId).removeClass("cur_viewed_day");
}

function constructCalendar() {
    let curNumDays = calendar.numDaysInMonth();
    var curRow = 0;
    let curDayIdx = undefined;
    let day = undefined;
    unfocusDay();

    // change days for current month
    for (day = 1; day <= curNumDays; ++day) {
        // 0 - sunday, ..., 6 - saturday
        curDayIdx = calendar.getDayName(day)

        if (day != 1 && curDayIdx == 1) {
            curRow += 1;
        }

        fillDay(curDayIdx, curRow, day);

        if (curFocusedDayId === undefined && day === calendar.curDay) {
            curFocusedDayId = constructDayId(curDayIdx, curRow, day);
            focusOnDay(curFocusedDayId);
        }
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

        fillDay(curDayIdx, curRow, day, "next_month");

        day += 1;
    }

    day = calendar.curMonth > 0 ? calendar.numDaysInMonth(calendar.curMonth - 1) : calendar.numDaysInMonth(11, calendar.curYear - 1);

    // cur day index is equal to the day index of first day of current month - 1
    for (curDayIdx = calendar.getDayName(1) - 1; curDayIdx >= 0; curDayIdx -= 1) {
        // we will always fill just 1st row
        fillDay(curDayIdx, 0, day, "prev_month");

        day -= 1;
    }

    //$('#calendar_month_select').val(calendar.curMonth);
    //$('#calendar_month_select').selectpicker('refresh');
    $('#calendar_month').html(calendar.getMonthName());
}

// col - 0 sunday, ..., 6 saturday
// row - there are 6 rows on calendar
function fillDay(col, row, day, addClass = undefined) {
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