import { redirect, RedirectType } from 'next/navigation';
import { getYears } from './layout';

export default async function Page() {
  const years = await getYears();
  const recentYear = years.length ? years[0] : null;

  if (recentYear) {
    redirect(`/revenue/${recentYear}`, RedirectType.replace);
  }

  return <>Aucune données.</>;
}
