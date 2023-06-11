import * as moment from 'moment-timezone';

export const localToTimezoneDate = (date, timezone, format) => {
  // console.log(date, timezone, format);
  // console.log(moment.tz(date, timezone.timeZoneIdentifier).format(''));
  // console.log(moment.tz(date, timezone.timeZoneIdentifier).format());
  // console.log(moment.tz(date, timezone.timeZoneIdentifier).format(format));
  return moment.tz(new Date(date), timezone.timeZoneIdentifier).format(format);
};

export const getTimezoneUTC = (date, timezone) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours();
  const min = d.getMinutes();
  let id = y + '-';
  if (m < 10) id += '0' + m + '-';
  else id += m + '-';
  if (day < 10) id += '0' + m + '-';
  else id += day + 'T';
  if (h < 10) id += '0' + h + ':';
  else id += h + ':';
  if (min < 10) id += '0' + min + ':00';
  else id += min + ':00';
  const offset = moment.tz(id, timezone.timeZoneIdentifier).format().substr(-6);
  id = id + offset;
  const du = moment.tz(id, timezone.timeZoneIdentifier);
  // console.log(du.format());
  // console.log(du.utc().format());
  return du.utc().format();
};

// const getDestOffset = (timezone) => {
//   const h = 1 * timezone.utcOffset.substr(1, 2);
//   const m = 1 * timezone.utcOffset.substr(4, 2);
//   let offset = (h * 60 + m) * 60 * 1000;
//   if (timezone.utcOffset[0] === '-') offset = 0 - offset;
//   // console.log(h, m, offset);

//   // const today = new Date();
//   // const stdTimezoneOffset = () => {
//   //   const jan = new Date(today.getFullYear(), 0, 1);
//   //   const jul = new Date(today.getFullYear(), 6, 1);
//   //   return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
//   // };
//   // const isDstObserved = () => today.getTimezoneOffset() < stdTimezoneOffset();

//   // if (isDstObserved()) {
//   //   offset = offset - 60 * 60 * 1000;
//   //   console.log('Dst Observed');
//   // }
//   // console.log('Timezone: ', timezone);
//   if (timezone.isDstObserved) {
//     // console.log('Timezone Dst Observed: ', timezone.isDstObserved);
//     offset = offset + 60 * 60 * 1000;
//   }
//   return offset;
// };

// export const localToTimezoneDate = (date, timezone) => {
//   const localTime = date.getTime();
//   const localOffset = date.getTimezoneOffset() * 60 * 1000;
//   const utcTime = localTime + localOffset;
//   return utcToTimezoneDate(utcTime, timezone);
// };

// export const utcToTimezoneDate = (utcTime, timezone) => {
//   const destOffset = getDestOffset(timezone);
//   const destTime = utcTime + destOffset;
//   const destDate = new Date(destTime);
//   return destDate;
// };
