class CalendarEvent {
    constructor (day, month, year, description, loop = false) {
        this.day = day;
        this.month = month;
        this.year = year;
        this.description = description;
        this.loop = loop;
    }

    generateEventHtml() {
        return '<p class="calendar_event text-left">- ' + this.description + '</p>';
    }
}