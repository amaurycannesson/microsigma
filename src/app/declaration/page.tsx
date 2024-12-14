import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Link from 'next/link';
import { formatCurrency, formatISODate, formatMonth } from '../utils';
import ActivityCalendar from './components/ActivityCalendar';
import getRecentCalendarData from './fetchers/getRecentCalendarData';
import getRecentActivities, { Revenue } from './fetchers/getRecentRevenue';

dayjs.extend(localizedFormat);

const ActivityReportTile = ({
  month,
  missingDays,
  hasActivity,
}: {
  month: Dayjs;
  missingDays: number;
  hasActivity: boolean;
}) => {
  return (
    <div className="whitespace-nowrap px-6 text-center">
      <div className="capitalize">{formatMonth(month)}</div>
      {hasActivity ? (
        <>
          <div className="text-3xl">{missingDays === 0 ? '✔️' : missingDays}</div>
          <div className="text-xs">
            {missingDays === 0 ? (
              <Link href="/activity">Télécharger le CRA</Link>
            ) : (
              <Link href="/activity">jours à compléter</Link>
            )}
          </div>
        </>
      ) : (
        '-'
      )}
    </div>
  );
};

const RevenueCells = ({
  month,
  revenue,
  note,
}: {
  month: Dayjs;
  revenue: Revenue | null;
  note?: string;
}) => {
  return (
    <>
      <td>
        <span className="capitalize">{formatMonth(month)}</span>{' '}
        <span className="text-sm italic text-gray-600">{note}</span>
      </td>
      <td className="text-right">{revenue?.days ?? '-'}</td>
      <td className="text-right">{revenue ? formatCurrency(revenue.excludingTaxes) : '-'}</td>
      <td className="text-right">{revenue ? formatCurrency(revenue.vatAmount) : '-'}</td>
      <td className="text-right">{revenue ? formatCurrency(revenue.includingTaxes) : '-'}</td>
    </>
  );
};

export default async function Page() {
  const { currRevenue, prevRevenue, penuRevenue, penuMonth } = await getRecentActivities();
  const { currMonth, prevMonth, currMissingDays, prevMissingDays, currActivities, prevActivities } =
    await getRecentCalendarData();

  return (
    <>
      <div className="flex w-full rounded-md bg-white shadow-md">
        <table className="m-6 w-full">
          <thead className="border-b-4">
            <tr>
              <th></th>
              <th className="text-right">Jours</th>
              <th className="text-right">HT</th>
              <th className="text-right">TVA</th>
              <th className="text-right">TTC</th>
            </tr>
          </thead>
          <tbody className="text-lg">
            <tr className="border-b-2">
              <RevenueCells month={currMonth} revenue={currRevenue} note="à facturer" />
            </tr>
            <tr className="border-b-2">
              <RevenueCells month={prevMonth} revenue={prevRevenue} note="à encaisser" />
            </tr>
            <tr>
              <RevenueCells month={penuMonth} revenue={penuRevenue} note="à déclarer" />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center rounded-md bg-white shadow-md">
        <div className="flex">
          <ActivityReportTile
            month={currMonth}
            missingDays={currMissingDays}
            hasActivity={!!currActivities.length}
          />
          <ActivityReportTile
            month={prevMonth}
            missingDays={prevMissingDays}
            hasActivity={!!prevActivities.length}
          />
        </div>
        <ActivityCalendar
          data={[...currActivities, ...prevActivities]}
          from={formatISODate(prevMonth)}
          to={formatISODate(currMonth.endOf('month'))}
        />
      </div>
    </>
  );
}
