class Event {
    constructor (day, month, year, description) {
        this.day = day;
        this.month = month;
        this.year = year;
        this.description = description;
    }

    generateEventString() {
        return '<p class="calendar_event text-left">- ' + this.description + '</p>';
    }
}