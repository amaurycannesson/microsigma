/*
Table activity is used to track self-employed activity, where each row corresponds to a single day's work.
id: Auto-incremented primary key, uniquely identifying each row.
date: The date when the work took place.
paid_at: The date when payment was received for that work.
rate: The Net Daily Rate (e.g., 100 euros).
estimated: A value between 0 and 1 that estimates the fraction of the day worked (e.g., 0.5 means half a day).
real: The actual fraction of the day worked (e.g., 0.75 means 75% of the day).
*/
CREATE TABLE `activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`paid_at` text NOT NULL,
	`rate` integer NOT NULL,
	`estimated` real NOT NULL,
	`real` real
);
--> statement-breakpoint
CREATE UNIQUE INDEX `activity_date_unique` ON `activity` (`date`);