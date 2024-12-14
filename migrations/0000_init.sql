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