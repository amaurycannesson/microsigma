import db from '@/db';
import { activityTable } from '@/schema';
import { sql } from 'drizzle-orm';
import { RedirectType, redirect } from 'next/navigation';
import YearSelector from './components/YearSelector';

export const getYears = async () => {
  const result = await db
    .selectDistinct({ year: sql<string>`strftime('%Y', ${activityTable.paidAt})`.as('year') })
    .from(activityTable)
    .orderBy(sql`year desc`);

  return result.map((r) => r.year);
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const years = await getYears();

  const selectYear = async (prevYear: string | null, formData: FormData) => {
    'use server';

    const selectedYear = formData.get('selectedYear');

    if (selectedYear) {
      redirect(`/revenue/${selectedYear}`, RedirectType.replace);
    }

    return null;
  };

  return (
    <div className="pt-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Suivre son chiffre d&apos;affaires</h1>
        <YearSelector years={years} onSelected={selectYear} />
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
