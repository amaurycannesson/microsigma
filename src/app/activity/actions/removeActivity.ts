'use server';

import { eachDayOfInterval, formatISODate } from '@/app/utils';
import db from '@/db';
import { activityTable } from '@/schema';
import dayjs, { Dayjs } from 'dayjs';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { ZodError, z } from 'zod';
import { SaveActivityResponse } from './saveActivity';

const removeActivitiesSchema = z.object({
  startDate: z.string().length(10).optional(),
  endDate: z.string().length(10).optional(),
  date: z.string().length(10).optional(),
});

export type RemoveActivitiesSchema = z.infer<typeof removeActivitiesSchema>;

export default async function removeActivity(formData: FormData): Promise<SaveActivityResponse> {
  let dates: Dayjs[] = [];

  try {
    const request = removeActivitiesSchema.parse(Object.fromEntries(formData));

    if (request.startDate) {
      const startDate = dayjs(request.startDate);
      const endDate = dayjs(request.endDate);

      dates = eachDayOfInterval(startDate, endDate);
    } else if (request.date) {
      dates.push(dayjs(request.date));
    }

    for (const date of dates) {
      await db.delete(activityTable).where(eq(activityTable.date, formatISODate(date)));
    }
  } catch (err) {
    if (err instanceof ZodError) {
      return { isSuccess: false, message: 'Invalid request' };
    }

    return { isSuccess: false, message: (err as Error).message };
  }

  revalidatePath('/', 'layout');

  return { isSuccess: true, message: `${dates.length} activities removed` };
}
