class Calendar {
    constructor() {
        this.date = new Date();

        this.curDay = this.date.getDate();
        //months are 0 indexed
        this.curMonth = this.date.getMonth();
        this.curYear = this.date.getFullYear();

        this.events = [];
    }

    // puts calendar into next month
    nextMonth() {
        if (this.curMonth < 11) {
            this.curMonth += 1;
        } else {
            this.curMonth = 0;
            this.curYear += 1;
        }
    }

    // puts calendar into prev month
    prevMonth() {
        if (this.curMonth > 0) {
            this.curMonth -= 1;
        } else {
            this.curMonth = 11;
            this.curYear -= 1;
        }
    }

    isTodaysDate(day = this.curDay, month = this.curMonth, year = this.curYear) {
        let date = new Date();

        return day === date.getDate() && month === date.getMonth() && year === date.getFullYear();
    }

    numDaysInMonth(month = this.curMonth, year = this.curYear) {
        // passing 0 will return us the last day in previous month
        return new Date(year, month + 1, 0).getDate();
    }

    // 0 - sunday, ... , 6 - saturday
    getDayIndex(day, month = this.curMonth, year = this.curYear) {
        return new Date(year, month, day).getDay();
    }

    getMonthName(month = this.curMonth) {
        switch (month) {
            case 0: return "January";
            case 1: return "February";
            case 2: return "March";
            case 3: return "April";
            case 4: return "May";
            case 5: return "June";
            case 6: return "July";
            case 7: return "August";
            case 8: return "September";
            case 9: return "October";
            case 10: return "November";
            case 11: return "December";
            default: return "";
        }
    }

    addEvent(curEvent) {
        this.events.push(curEvent);
    }

    getEvents(day = this.curDay, month = this.curMonth, year = this.curYear) {
        let events = [];
        this.events.forEach(e => {
            if (e.day == day && e.month == month && (e.year == year || e.loop)) {
                events.push(e);
            }
        })
        return events;
    }

  }