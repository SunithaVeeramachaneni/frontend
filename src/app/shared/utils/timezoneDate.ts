import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';

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
