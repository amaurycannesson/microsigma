import { formatISOMonth, getCurrentMonth, getLastMonth } from '@/app/utils';
import db from '@/db';
import { activityTable } from '@/schema';
import { Dayjs } from 'dayjs';
import { sql } from 'drizzle-orm';

export type ActitvityEntry = {
  day: string;
  value: number;
};

export type RecentCalendarData = {
  prevActivities: ActitvityEntry[];
  currActivities: ActitvityEntry[];
  prevMonth: Dayjs;
  currMonth: Dayjs;
  prevMissingDays: number;
  currMissingDays: number;
};

const getCalendarDataByMonth = async (month: string) => {
  return await db
    .select({
      day: activityTable.date,
      value: sql<number>`case when ${activityTable.real} is NULL then 0 else 1 end`,
      real: activityTable.real,
    })
    .from(activityTable)
    .where(sql.raw(`date like '${month}%'`));
};

export default async function getRecentCalendarData(): Promise<RecentCalendarData> {
  const currMonth = getCurrentMonth();
  const prevMonth = getLastMonth();

  const currActivities = await getCalendarDataByMonth(formatISOMonth(currMonth));
  const prevActivities = await getCalendarDataByMonth(formatISOMonth(prevMonth));

  const currMissingDays = currActivities.reduce(
    (acc, cur) => (cur.real === null ? acc + 1 : acc),
    0
  );
  const prevMissingDays = prevActivities.reduce(
    (acc, cur) => (cur.real === null ? acc + 1 : acc),
    0
  );

  return {
    currActivities,
    prevActivities,
    currMonth,
    prevMonth,
    currMissingDays,
    prevMissingDays,
  };
}
