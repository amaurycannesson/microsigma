import { formatISOMonth, getCurrentMonth, getLastMonth, getMonthBefore } from '@/app/utils';
import config from '@/config';
import db from '@/db';
import { activityTable } from '@/schema';
import { Dayjs } from 'dayjs';
import { sql } from 'drizzle-orm';

export type Revenue = {
  vatAmount: number;
  excludingTaxes: number;
  includingTaxes: number;
  days: number;
};

export type RecentRevenues = {
  prevMonth: Dayjs;
  currMonth: Dayjs;
  penuMonth: Dayjs;
  prevRevenue: Revenue | null;
  currRevenue: Revenue | null;
  penuRevenue: Revenue | null;
};

const getRevenuesByMonth = async (month: string, { hasVAT }: { hasVAT: boolean }) => {
  const revenue = db.$with('revenue').as(
    db
      .select({
        days: sql<number | null>`sum(ifnull(${activityTable.real},0))`.as('days'),
        revenue: sql<number | null>`sum(ifnull(${activityTable.real},0)*rate)`.as('revenue'),
        real: activityTable.real,
      })
      .from(activityTable)
      .where(sql.raw(`date like '${month}%'`))
  );

  return await db
    .with(revenue)
    .select({
      days: revenue.days,
      excludingTaxes: revenue.revenue,
      vatAmount: hasVAT ? sql<number | null>`${revenue.revenue} * 0.2` : sql<number>`0`,
      includingTaxes: hasVAT
        ? sql<number | null>`${revenue.revenue} + ${revenue.revenue} * 0.2`
        : revenue.revenue,
    })
    .from(revenue);
};

export default async function getRevenues(): Promise<RecentRevenues> {
  const currMonth = getCurrentMonth();
  const prevMonth = getLastMonth();
  const penuMonth = getMonthBefore(getLastMonth());

  const currRevenue = await getRevenuesByMonth(formatISOMonth(currMonth), {
    hasVAT: config.vatStartDate.isBefore(currMonth),
  });
  const prevRevenue = await getRevenuesByMonth(formatISOMonth(prevMonth), {
    hasVAT: config.vatStartDate.isBefore(prevMonth),
  });
  const penuRevenue = await getRevenuesByMonth(formatISOMonth(penuMonth), {
    hasVAT: config.vatStartDate.isBefore(penuMonth),
  });

  return {
    currMonth,
    prevMonth,
    penuMonth,
    currRevenue:
      currRevenue[0] && currRevenue[0].days !== null ? (currRevenue[0] as Revenue) : null,
    prevRevenue:
      prevRevenue[0] && prevRevenue[0].days !== null ? (prevRevenue[0] as Revenue) : null,
    penuRevenue:
      penuRevenue[0] && penuRevenue[0].days !== null ? (penuRevenue[0] as Revenue) : null,
  };
}
