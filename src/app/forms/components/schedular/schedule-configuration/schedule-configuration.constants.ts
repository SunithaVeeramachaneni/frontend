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
  assignTypes: ['user', 'userGroup'] // ['user', 'userGroup', 'plant']
});

export const TIME_SLOTS: string[] = [
  '12:00 AM',
  '1:00 AM',
  '2:00 AM',
  '3:00 AM',
  '4:00 AM',
  '5:00 AM',
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  '11:00 PM',
  '12:00 AM'
];

export const shiftDefaultPayload = {
  null: [{ startTime: '12:00 AM', endTime: '11:59 PM' }]
};

export const enum TimeType {
  am = 'AM',
  pm = 'PM'
}
