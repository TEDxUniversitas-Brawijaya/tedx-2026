ALTER TABLE `verifications` RENAME COLUMN "token" TO "value";--> statement-breakpoint
DROP INDEX `verifications_token_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `verifications_value_unique` ON `verifications` (`value`);