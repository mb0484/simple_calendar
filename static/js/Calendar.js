class Calendar {
    constructor() {
        this.date = new Date();

        this.curDay = this.date.getDate();
        //months are 0 indexed
        this.curMonth = this.date.getMonth();
        this.curYear = this.date.getFullYear();
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

    numDaysInMonth(month = this.curMonth, year = this.curYear) {
        // passing 0 will return us the last day in previous month
        return new Date(year, month + 1, 0).getDate();
    }

    // 0 - sunday, ... , 6 - saturday
    getDayName(day, month = this.curMonth, year = this.curYear) {
        // we have to add 1, beacuse months are 0 indexed
        return new Date(year, month, day).getDay();
    }

    getMonthName(month = this.curMonth) {
        switch (month) {
            case 0: return "Januar";
            case 1: return "Februar";
            case 2: return "Marec";
            case 3: return "April";
            case 4: return "Maj";
            case 5: return "Junij";
            case 6: return "Julij";
            case 7: return "Avgust";
            case 8: return "September";
            case 9: return "Oktober";
            case 10: return "November";
            case 11: return "December";
            default: return "";
        }
    }

  }