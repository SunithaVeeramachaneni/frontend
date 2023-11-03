import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import { dateFormat6, dateTimeFormat4 } from 'src/app/app.constants';
const {
  isSameDay,
  isBefore,
  getDay,
  getWeekOfMonth,
  format
} = require('date-fns');

export const localToTimezoneDate = (date, timezone, f) => {
  if (isNaN(Date.parse(date))) return '';
  if (f === '') f = 'yyyy-MM-dd HH:mm:ss zzz';
  if (!timezone?.timeZoneIdentifier) return format(new Date(date), f);
  return formatInTimeZone(new Date(date), timezone.timeZoneIdentifier, f);
};

/**
 * @description Format a date according to the format specified
 * @param date
 * @param timezone
 * @param dateformat
 */
export const localToTimezoneDateV2 = (date, timezone, dateformat = '') => {
  if (!date) {
    return '';
  }
  if (dateformat === '') dateformat = 'yyyy-MM-dd HH:mm:ss zzz';
  const onlyDate = date?.split('T')[0];
  const dateObject = new Date(onlyDate);

  const dateTime = new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const formatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: timezone.timeZoneIdentifier
  };

  const formattedDate: string = new Intl.DateTimeFormat(
    'en-US',
    formatOptions as unknown
  ).format(dateObject);

  return format(
    new Date(formattedDate + ' ' + dateTime?.toUpperCase()),
    dateformat
  );
};

export const getTimezoneUTC = (date, timezone) => {
  const d = new Date(date);
  if (!timezone?.timeZoneIdentifier) return d.toISOString();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const min = d.getMinutes();
  const sec = d.getSeconds();
  let id = year + '-';
  if (month < 10) id += '0' + month + '-';
  else id += month + '-';
  if (day < 10) id += '0' + day + ' ';
  else id += day + ' ';
  if (hour < 10) id += '0' + hour + ':';
  else id += hour + ':';
  if (min < 10) id += '0' + min + ':';
  else id += min + ':';
  if (sec < 10) id += '0' + sec;
  else id += sec;
  return zonedTimeToUtc(id, timezone.timeZoneIdentifier).toISOString();
};

const getTimezoneDate = (date) => new Date(date).getTime();

const getTimezoneDayStart = (date, timezone) => {
  if (!timezone?.timeZoneIdentifier)
    return getTimezoneDate(format(new Date(date), dateTimeFormat4));
  const d = formatInTimeZone(
    date,
    timezone.timeZoneIdentifier,
    dateTimeFormat4
  );
  return getTimezoneDate(zonedTimeToUtc(d, timezone.timeZoneIdentifier));
};

const getTimezoneDayEnd = (date, timezone) => {
  if (!timezone?.timeZoneIdentifier)
    return getTimezoneDate(format(new Date(date), 'yyyy-MM-dd 23:59:59'));
  const d = formatInTimeZone(
    date,
    timezone.timeZoneIdentifier,
    'yyyy-MM-dd 23:59:59'
  );
  return getTimezoneDate(zonedTimeToUtc(d, timezone.timeZoneIdentifier));
};

export const isSameDayTz = (d1, d2, timezone) => {
  if (!timezone?.timeZoneIdentifier)
    return isSameDay(new Date(d1), new Date(d2));
  const startTime = getTimezoneDayStart(d1, timezone);
  const endTime = getTimezoneDayEnd(d1, timezone);
  const d2Time = getTimezoneDate(d2);
  return startTime <= d2Time && d2Time <= endTime;
};

export const isBeforeTz = (d1, d2, timezone) => {
  if (!timezone?.timeZoneIdentifier)
    return isBefore(new Date(d1), new Date(d2));
  const startTime = getTimezoneDayStart(d2, timezone);
  const d1Time = getTimezoneDate(d1);
  return d1Time < startTime;
};

export const getDayTz = (date, timezone) => {
  if (!timezone?.timeZoneIdentifier) return getDay(new Date(date));
  const d = formatInTimeZone(date, timezone.timeZoneIdentifier, dateFormat6);
  return getDay(new Date(d));
};

export const getWeekOfMonthTz = (date, timezone) => {
  if (!timezone?.timeZoneIdentifier) return getWeekOfMonth(new Date(date));
  const d = formatInTimeZone(date, timezone.timeZoneIdentifier, dateFormat6);
  return getWeekOfMonth(new Date(d));
};
