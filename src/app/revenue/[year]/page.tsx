import db from '@/db';
import { activityTable } from '@/schema';
import dayjs, { Dayjs } from 'dayjs';
import { sql } from 'drizzle-orm';
import config from '../../../config';
import {
  formatCurrency,
  formatISODate,
  formatISOMonth,
  formatMonth,
  getMonthAfter,
} from '../../utils';
import RevenueChart from '../components/RevenueChart';

const getDetails = async ({
  year,
  acreStartDate,
  acreEndDate,
  acreRate,
  contributionRate,
  taxAbatement,
  incomeTaxRate,
}: {
  year: string;
  acreStartDate: Dayjs;
  acreEndDate: Dayjs;
  acreRate: number;
  contributionRate: number;
  taxAbatement: number;
  incomeTaxRate: number;
}) => {
  const revenue = db.$with('revenue').as(
    db
      .select({
        month: sql<string>`strftime('%Y-%m', ${activityTable.paidAt})`.as('month'),
        revenue:
          sql<number>`sum(coalesce(${activityTable.real},${activityTable.estimated})*${activityTable.rate})`.as(
            'revenue'
          ),
        contributionRate: sql<number>`case when ${activityTable.paidAt} between ${formatISODate(
          acreStartDate
        )} and ${formatISODate(acreEndDate)} then ${acreRate} else ${contributionRate} end`.as(
          'contributionRate'
        ),
      })
      .from(activityTable)
      .where(sql.raw(`paid_at like '${year}%'`))
      .groupBy(sql`month`)
      .orderBy(sql`month asc`)
  );

  const revenueWithTax = db.$with('revenueWithTax').as(
    db
      .with(revenue)
      .select({
        month: revenue.month,
        revenue: revenue.revenue,
        contribution: sql<number>`${revenue.revenue} * ${revenue.contributionRate}`.as(
          'contribution'
        ),
        net: sql<number>`${revenue.revenue} - ${revenue.revenue} * ${revenue.contributionRate}`.as(
          'net'
        ),
        incomeTax:
          sql<number>`(${revenue.revenue} - ${revenue.revenue} * ${taxAbatement}) * ${incomeTaxRate}`.as(
            'incomeTax'
          ),
      })
      .from(revenue)
  );

  return await db
    .with(revenueWithTax)
    .select({
      month: revenueWithTax.month,
      revenue: revenueWithTax.revenue,
      contribution: revenueWithTax.contribution,
      net: revenueWithTax.net,
      incomeTax: revenueWithTax.incomeTax,
      profits: sql<number>`${revenueWithTax.net} - ${revenueWithTax.incomeTax}`,
    })
    .from(revenueWithTax);
};

export default async function Page({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const _details = await getDetails({
    year,
    acreStartDate: config.acreStartDate,
    acreEndDate: config.acreEndDate,
    acreRate: config.acreRate,
    contributionRate: config.socialContributionRate,
    taxAbatement: config.taxAbatement,
    incomeTaxRate: config.incomeTaxRate,
  });
  const emptyDetail: (typeof _details)[0] = {
    month: '',
    revenue: 0,
    contribution: 0,
    incomeTax: 0,
    net: 0,
    profits: 0,
  };
  const details = _details.reduce<typeof _details>((acc, curr) => {
    if (acc.length >= 1) {
      let lastMonth = dayjs(acc[acc.length - 1].month);
      while (dayjs(curr.month).diff(lastMonth, 'month') >= 2) {
        const nextMonth = getMonthAfter(lastMonth);
        acc.push({ ...emptyDetail, month: formatISOMonth(nextMonth) });
        lastMonth = nextMonth;
      }
    }
    return [...acc, curr];
  }, []);
  const graphDetails = details.map((d) => ({
    month: formatMonth(dayjs(d.month)),
    Bénéfices: d.profits,
    Taxes: d.contribution + d.incomeTax,
  }));

  return (
    <>
      <div className="rounded-md bg-white shadow-md">
        <RevenueChart data={graphDetails} />
      </div>
      <div className="mt-3 rounded-md bg-white p-3 shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b-4">
              <th></th>
              <th className="text-right">CA</th>
              <th className="text-right">Cotis.</th>
              <th className="text-right">Rev. Net</th>
              <th className="text-right">Impot</th>
              <th className="text-right">Bénéfices</th>
            </tr>
          </thead>
          <tbody className="[&>*:nth-child(odd)]:bg-gray-50">
            {details.map((d) => (
              <tr key={d.month} className="border-b-2">
                <td className="py-1 capitalize">{formatMonth(dayjs(d.month))}</td>
                <td className="text-right">{formatCurrency(d.revenue)}</td>
                <td className="text-right">{formatCurrency(d.contribution)}</td>
                <td className="text-right">{formatCurrency(d.net)}</td>
                <td className="text-right">{formatCurrency(d.incomeTax)}</td>
                <td className="text-right">{formatCurrency(d.profits)}</td>
              </tr>
            ))}
            <tr className="bg-gray-100">
              <td></td>
              <td className="text-right">
                {formatCurrency(details.reduce((sum, d) => sum + d.revenue, 0))}
              </td>
              <td className="text-right">
                {formatCurrency(details.reduce((sum, d) => sum + d.contribution, 0))}
              </td>
              <td className="text-right">
                {formatCurrency(details.reduce((sum, d) => sum + d.net, 0))}
              </td>
              <td className="text-right">
                {formatCurrency(details.reduce((sum, d) => sum + d.incomeTax, 0))}
              </td>
              <td className="text-right">
                {formatCurrency(details.reduce((sum, d) => sum + d.profits, 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
