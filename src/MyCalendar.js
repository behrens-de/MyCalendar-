
export class MyCalendar {
    constructor({ target, date, lang } = {}) {
        this.target = target || '.my-calendar';
        this.date = date || new Date();
        this.lang = lang || 'de';
    }
    _month = {
        de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    }

    _weekDay = {
        de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donerstag', 'Freitag', 'Samstag', 'Sontag']
    }

    isLeapYear() {
        let date = this.date;
        let currentYear = date.getFullYear();
        if ((currentYear % 4 === 0 || currentYear % 400 === 0) && currentYear % 100 !== 0) return true;
        return false;
    }

    calendaWeek(date = this.date) {
        let currentThursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);
        let yearOfThursday = currentThursday.getFullYear();
        let firstThursday = new Date(new Date(yearOfThursday, 0, 4).getTime() + (3 - ((new Date(yearOfThursday, 0, 4).getDay() + 6) % 7)) * 86400000);
        return Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);
    }

    uiContent() {
        const content = document.createElement('div');
        content.innerHTML = 'ich bin der Content';
        return content;
    }


    calculateNewDate({ day = 0, month = 0, year = 0 } = {}) {
        return new Date(this.date.getFullYear() + year, this.date.getMonth() + month, this.date.getDate() + day);
    }

    changeDate(newDate) {
        this.date = newDate;
        this.create();
    }

    uiChangeButton({ classname, txt, date } = {}) {
        const button = document.createElement('button');
        button.className = classname ?? 'btn';
        button.innerHTML = txt ?? 'unKnowed';
        button.onclick = () => this.changeDate(date);
        return button;
    }

    uiHeaderControll(type) {

        const possibleTypes = ['day', 'month', 'year'];
        const DATE = this.date;
        const wrap = document.createElement('div');
        wrap.className = 'myc-head-control'
        if (!possibleTypes.includes(type)) {
            wrap.innerHTML = "ERROR";
            console.warn('Wrong Type used');
            return wrap;
        }

        const labelTxt = {
            day: DATE.getDate(),
            month: this._month[this.lang][DATE.getMonth()],
            year: DATE.getFullYear()
        }

        const label = document.createElement('div');
        label.innerHTML = labelTxt[type];
        const btnNext = this.uiChangeButton({ txt: `Next ${type}`, date: this.calculateNewDate({ [type]: 1 }) });
        btnNext.classList.add('btn-next');
        const btnLast = this.uiChangeButton({ txt: `Last ${type}`, date: this.calculateNewDate({ [type]: -1 }) });
        btnLast.classList.add('btn-last');

        wrap.appendChild(btnLast)
        wrap.appendChild(label)
        wrap.appendChild(btnNext)

        return wrap;
    }

    uiHeaderWeekday() {
        const div = document.createElement('div');
        div.innerHTML = this._weekDay[this.lang][this.date.getDay()];
        div.classList.add('myc-header-weekday');
        return div;
    }

    uiHeaderCalendarWeek() {
        const div = document.createElement('div');
        div.classList.add('myc-header-weeknumber');

        const label = document.createElement('span');
        label.innerHTML = 'Kalenderwoche';

        const kw = document.createElement('span');
        kw.innerHTML = this.calendaWeek(this.date);

        div.appendChild(label);
        div.appendChild(kw);

        return div;
    }

    uiHeader() {
        const header = document.createElement('div');
        const headerMeta = document.createElement('div');

        headerMeta.appendChild(this.uiHeaderWeekday());
        headerMeta.appendChild(this.uiHeaderCalendarWeek());
        headerMeta.classList.add('myc-header-meta');

        header.appendChild(headerMeta);


        const headControl = document.createElement('div');
        headControl.classList.add('myc-header');

        headControl.appendChild(this.uiHeaderControll('day'));
        headControl.appendChild(this.uiHeaderControll('month'));
        headControl.appendChild(this.uiHeaderControll('year'));

        header.appendChild(headControl);

        return header;
    }




    uiSelectYear() {
        const select = document.createElement('div');
        select.className = 'myc-selectbox-year'

        const date = this.calculateNewDate({ year: -2 });
        const startYear = date.getFullYear();

        const startDecade = (currentYear) => {
            return parseInt(currentYear / 10) * 10
        };

        //const year = this.calculateNewDate({year:-8});
        const start = startDecade(this.date.getFullYear());
        const end = start + 10;

        const tenBack = document.createElement('div');
        tenBack.innerHTML = '-10';
        tenBack.className = 'myc-subselect';
        tenBack.onclick = () => {
            this.changeDate(this.calculateNewDate({ year: -10 }));
        }
        select.appendChild(tenBack);

        for (let ii = start; ii < end; ii++) {

            const subSelect = document.createElement('div');
            const year = this.calculateNewDate({ year: ii - this.date.getFullYear() })

            subSelect.className = this.date.getFullYear() === year.getFullYear()
                ? 'myc-subselect-active'
                : 'myc-subselect';

            subSelect.innerHTML = year.getFullYear();
            subSelect.onclick = () => {
                this.changeDate(year);
            }
            select.appendChild(subSelect);

        }

        const tenForward = document.createElement('div');
        tenForward.innerHTML = '+10';
        tenForward.className = 'myc-subselect';
        tenForward.onclick = () => {
            this.changeDate(this.calculateNewDate({ year: 10 }));
        }
        select.appendChild(tenForward);

        return select;
    }

    uiSelectMonth() {
        const select = document.createElement('div');
        select.className = 'myc-selectbox-month'
        const months = this._month[this.lang];

        months.forEach(month => {
            const subSelect = document.createElement('div');


            subSelect.className = month === this._month[this.lang][this.date.getMonth()]
                ? 'myc-subselect-active'
                : 'myc-subselect';

            subSelect.innerHTML = month;
            select.appendChild(subSelect);

        });
        return select;

    }

    create() {
        const wrap = document.querySelector(this.target);
        wrap.innerHTML = null;

        // Header
        const header = this.uiHeader();
        const selectYear = this.uiSelectYear();
        const selectMonth = this.uiSelectMonth();

        // Content
        const content = this.uiContent();



        // Build the calendar
        wrap.appendChild(header);
        wrap.appendChild(selectYear);
        wrap.appendChild(selectMonth);
        wrap.appendChild(content);


        // End of Creation
    }
}

