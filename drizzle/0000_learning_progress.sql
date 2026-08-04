CREATE TABLE `demo_users` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`pin_hash` text NOT NULL,
	`total_xp` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `demo_users_display_name_unique` ON `demo_users` (`display_name`);
--> statement-breakpoint
CREATE TABLE `learning_sessions` (
	`token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `demo_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `mission_progress` (
	`user_id` text NOT NULL,
	`mission_id` integer NOT NULL,
	`status` text NOT NULL,
	`code` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`completed_at` text,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `mission_id`),
	FOREIGN KEY (`user_id`) REFERENCES `demo_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_learning_sessions_user_expiry` ON `learning_sessions` (`user_id`,`expires_at`);
--> statement-breakpoint
CREATE INDEX `idx_mission_progress_user_status` ON `mission_progress` (`user_id`,`status`);
--> statement-breakpoint
PRAGMA optimize;
