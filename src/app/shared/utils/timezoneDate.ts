const getDestOffset = (timezone) => {
  const h = 1 * timezone.utcOffset.substr(1, 2);
  const m = 1 * timezone.utcOffset.substr(4, 2);
  let offset = (h * 60 + m) * 60 * 1000;
  if (timezone.utcOffset[0] === '-') offset = 0 - offset;
  // console.log(h, m, offset);

  // const today = new Date();
  // const stdTimezoneOffset = () => {
  //   const jan = new Date(today.getFullYear(), 0, 1);
  //   const jul = new Date(today.getFullYear(), 6, 1);
  //   return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  // };
  // const isDstObserved = () => today.getTimezoneOffset() < stdTimezoneOffset();

  // if (isDstObserved()) {
  //   offset = offset - 60 * 60 * 1000;
  //   console.log('Dst Observed');
  // }
  // console.log('Timezone: ', timezone);
  if (timezone.isDstObserved) {
    // console.log('Timezone Dst Observed: ', timezone.isDstObserved);
    offset = offset + 60 * 60 * 1000;
  }
  return offset;
};

export const localToTimezoneDate = (date, timezone) => {
  const localTime = date.getTime();
  const localOffset = date.getTimezoneOffset() * 60 * 1000;
  const utcTime = localTime + localOffset;
  return utcToTimezoneDate(utcTime, timezone);
};

export const utcToTimezoneDate = (utcTime, timezone) => {
  const destOffset = getDestOffset(timezone);
  const destTime = utcTime + destOffset;
  const destDate = new Date(destTime);
  return destDate;
};
