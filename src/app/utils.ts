import dayjs, { Dayjs } from 'dayjs';

export const eachDayOfInterval = (startDate: Dayjs, endDate: Dayjs) => {
  const days = [];

  let curDay = dayjs(startDate);
  days.push(curDay);

  while (!curDay.isSame(endDate, 'date')) {
    curDay = curDay.add(1, 'day');
    days.push(curDay);
  }

  return days;
};

export const getCurrentMonth = () => {
  return dayjs().date(1);
};

export const getLastMonth = () => {
  return getMonthBefore(getCurrentMonth());
};

export const getMonthAfter = (date: Dayjs) => {
  return date.date(1).add(1, 'month');
};

export const getMonthBefore = (date: Dayjs) => {
  return date.date(1).subtract(1, 'month');
};

export const formatISOMonth = (date: Dayjs) => {
  return date.format('YYYY-MM');
};

export const formatISODate = (date: Dayjs) => {
  return date.format('YYYY-MM-DD');
};

export const formatMonth = (date: Dayjs) => {
  return date.locale('fr').format('MMMM YYYY');
};

export const isWeekend = (date: Dayjs) => {
  return date.get('day') == 0 || date.get('day') == 6;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr', { style: 'currency', currency: 'EUR' }).format(amount);
};
