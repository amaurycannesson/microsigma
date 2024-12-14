import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const activityTable = sqliteTable('activity', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  date: text('date').unique().notNull(),
  paidAt: text('paid_at').notNull(),
  rate: integer('rate', { mode: 'number' }).notNull(),
  estimated: real('estimated').notNull(),
  real: real('real'),
});

export const activitySchema = createSelectSchema(activityTable);
export const newActivitySchema = createSelectSchema(activityTable, {
  rate: z.coerce.number().min(1),
  estimated: z.coerce.number().min(0).max(1),
  real: z.coerce.number().min(0).max(1).nullable().default(null),
}).omit({ id: true });

export type Activity = typeof activityTable.$inferSelect;
export type NewActivity = typeof activityTable.$inferInsert;
