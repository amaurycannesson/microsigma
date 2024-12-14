import db from '@/db';
import { activityTable, type Activity } from '@/schema';
import removeActivity from './actions/removeActivity';
import saveActivity from './actions/saveActivity';
import ActivityCalendar from './components/ActivityCalendar';

async function getActivities() {
  return await db.select().from(activityTable);
}

export default async function Page() {
  const activities = await getActivities();
  const activitiesByDate = activities.reduce<Record<string, Activity>>((acc, curr) => {
    acc[curr.date] = curr;
    return acc;
  }, {});

  return (
    <>
      <ActivityCalendar
        activitiesByDate={activitiesByDate}
        onSave={saveActivity}
        onRemove={removeActivity}
      />
    </>
  );
}
