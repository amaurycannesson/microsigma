'use server';

import { eachDayOfInterval, formatISODate, getMonthAfter, isWeekend } from '@/app/utils';
import db from '@/db';
import { NewActivity, activityTable, newActivitySchema } from '@/schema';
import dayjs from 'dayjs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const upsertMany = async (
  bulkRequest: SaveManyActivitiesSchema,
  activity: NewActivity
): Promise<SaveActivityResponse> => {
  const startDate = dayjs(bulkRequest.startDate);
  const endDate = dayjs(bulkRequest.endDate);

  const dates = eachDayOfInterval(startDate, endDate).filter(
    (date) => !bulkRequest.ignoreWeekends || !isWeekend(date)
  );

  for (const date of dates) {
    activity.date = formatISODate(date);
    activity.paidAt = formatISODate(getMonthAfter(date));

    const result = await upsertOne(activity, { insertOnly: bulkRequest.insertOnly });

    if (!result.isSuccess) return result;
  }

  return { isSuccess: true, message: `${dates.length} activities upserted` };
};

const upsertOne = async (
  activity: NewActivity,
  { insertOnly } = { insertOnly: false }
): Promise<SaveActivityResponse> => {
  try {
    let result: { activityId: number }[];

    if (insertOnly) {
      result = await db
        .insert(activityTable)
        .values(activity)
        .onConflictDoNothing()
        .returning({ activityId: activityTable.id });
    } else {
      result = await db
        .insert(activityTable)
        .values(activity)
        .onConflictDoUpdate({ target: activityTable.date, set: activity })
        .returning({ activityId: activityTable.id });
    }

    return {
      isSuccess: true,
      message: result[0] ? `Activity ${result[0].activityId} upserted` : 'Nothing to upsert',
    };
  } catch (err) {
    return { isSuccess: false, message: (err as Error).message };
  }
};

export type SaveActivityResponse = {
  isSuccess: boolean;
  message: string;
};

const saveManyActivitiesSchema = z.object({
  startDate: z.string().length(10),
  endDate: z.string().length(10),
  ignoreWeekends: z.coerce.boolean(),
  insertOnly: z.coerce.boolean(),
});

export type SaveManyActivitiesSchema = z.infer<typeof saveManyActivitiesSchema>;

export default async function saveActivity(formData: FormData): Promise<SaveActivityResponse> {
  let result: SaveActivityResponse;

  if (formData.get('startDate')) {
    const manyParsedResult = saveManyActivitiesSchema.safeParse(Object.fromEntries(formData));
    const oneParsedResult = newActivitySchema.safeParse(Object.fromEntries(formData));

    if (!manyParsedResult.success || !oneParsedResult.success) {
      return { isSuccess: false, message: 'Invalid request' };
    }

    result = await upsertMany(manyParsedResult.data, oneParsedResult.data);
  } else {
    const parsedResult = newActivitySchema.safeParse(Object.fromEntries(formData));

    if (!parsedResult.success) {
      return { isSuccess: false, message: 'Invalid request' };
    }

    result = await upsertOne(parsedResult.data);
  }

  revalidatePath('/', 'layout');

  return result;
}
