import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
const { isSameDay, isBefore, getDay, getWeekOfMonth } = require('date-fns');

export const localToTimezoneDate = (date, timezone, format) => {
  if (format === '') format = 'yyyy-MM-dd HH:mm:ss zzz';
  return formatInTimeZone(new Date(date), timezone.timeZoneIdentifier, format);
};

export const getTimezoneUTC = (date, timezone) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const min = d.getMinutes();
  const sec = d.getSeconds();
  let id = year + '-';
  if (month < 10) id += '0' + month + '-';
  else id += month + '-';
  if (day < 10) id += '0' + month + ' ';
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
  const d = formatInTimeZone(
    date,
    timezone.timeZoneIdentifier,
    'yyyy-MM-dd 00:00:00'
  );
  return getTimezoneDate(zonedTimeToUtc(d, timezone.timeZoneIdentifier));
};

const getTimezoneDayEnd = (date, timezone) => {
  const d = formatInTimeZone(
    date,
    timezone.timeZoneIdentifier,
    'yyyy-MM-dd 23:59:59'
  );
  return getTimezoneDate(zonedTimeToUtc(d, timezone.timeZoneIdentifier));
};

export const isSameDayTz = (d1, d2, timezone) => {
  if (!timezone) return isSameDay(new Date(d1), new Date(d2));
  const startTime = getTimezoneDayStart(d1, timezone);
  const endTime = getTimezoneDayEnd(d1, timezone);
  const d2Time = getTimezoneDate(d2);
  return startTime <= d2Time && d2Time <= endTime;
};

export const isBeforeTz = (d1, d2, timezone) => {
  if (!timezone) return isBefore(new Date(d1), new Date(d2));
  const startTime = getTimezoneDayStart(d2, timezone);
  const d1Time = getTimezoneDate(d1);
  return d1Time < startTime;
};

export const getDayTz = (date, timezone) => {
  if (!timezone) return getDay(new Date(date));
  const d = formatInTimeZone(date, timezone.timeZoneIdentifier, 'dd MMM yyyy');
  return getDay(new Date(d));
};

export const getWeekOfMonthTz = (date, timezone) => {
  if (!timezone) return getWeekOfMonth(new Date(date));
  const d = formatInTimeZone(date, timezone.timeZoneIdentifier, 'dd MMM yyyy');
  return getWeekOfMonth(new Date(d));
};
