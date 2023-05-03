export const scheduleConfigs = Object.freeze({
  scheduleTypes: ['byFrequency', 'byDate'],
  scheduleEndTypes: ['on', 'after'], // ['never', 'on', 'after']
  repeatTypes: ['day', 'week', 'month'],
  daysOfWeek: [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ],
  weeksOfMonth: ['1st Week', '2nd Week', '3rd Week', '4th Week', '5th Week'],
  assignTypes: ['user'] // ['user', 'userGroup', 'plant']
});
