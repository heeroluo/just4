import { hasOwnProp } from "@just4/util/object";

const TimeUnits = {
    SEC: 1e3,
    MIN: 60 * 1e3,
    HOUR: 60 * 60 * 1e3,
    DAY: 24 * 60 * 60 * 1e3,
    MONTH: 30 * 24 * 60 * 60 * 1e3,
    YEAR: 365 * 24 * 60 * 60 * 1e3
};

export function parse(timespan) {
    if (typeof timespan === "number") {
        return timespan;
    }
    if (!isNaN(Number(timespan))) {
        return Number(timespan);
    }
    const num = parseFloat(timespan);
    if (isNaN(num)) {
        throw new Error("Invalid timespan string");
    }
    const unit = timespan.split(num.toString())[1].trim().toUpperCase().replace(/S$/, "");
    if (hasOwnProp(TimeUnits, unit)) {
        return num * TimeUnits[unit];
    } else {
        throw new Error('Invalid time unit "' + unit + '"');
    }
}

export function addToDate(date, timespan) {
    return new Date((typeof date === "number" ? date : date.getTime()) + parse(timespan));
}