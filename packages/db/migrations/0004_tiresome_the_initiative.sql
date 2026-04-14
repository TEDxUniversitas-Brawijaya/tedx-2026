PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`buyer_name` text NOT NULL,
	`buyer_email` text NOT NULL,
	`buyer_phone` text NOT NULL,
	`buyer_college` text NOT NULL,
	`total_price` integer NOT NULL,
	`idempotency_key` text NOT NULL,
	`expires_at` text NOT NULL,
	`paid_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`payment_method` text NOT NULL,
	`midtrans_order_id` text,
	`proof_image_url` text,
	`verified_by` text,
	`verified_at` text,
	`rejection_reason` text,
	`refund_token` text NOT NULL,
	`picked_up_at` text,
	`picked_up_by` text,
	FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`picked_up_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_orders`("id", "type", "status", "buyer_name", "buyer_email", "buyer_phone", "buyer_college", "total_price", "idempotency_key", "expires_at", "paid_at", "created_at", "updated_at", "payment_method", "midtrans_order_id", "proof_image_url", "verified_by", "verified_at", "rejection_reason", "refund_token", "picked_up_at", "picked_up_by") SELECT "id", "type", "status", "buyer_name", "buyer_email", "buyer_phone", "buyer_college", "total_price", "idempotency_key", "expires_at", "paid_at", "created_at", "updated_at", "payment_method", "midtrans_order_id", "proof_image_url", "verified_by", "verified_at", "rejection_reason", "refund_token", "picked_up_at", "picked_up_by" FROM `orders`;--> statement-breakpoint
DROP TABLE `orders`;--> statement-breakpoint
ALTER TABLE `__new_orders` RENAME TO `orders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `orders_idempotencyKey_unique` ON `orders` (`idempotency_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_refundToken_unique` ON `orders` (`refund_token`);--> statement-breakpoint
CREATE INDEX `orders_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `orders_type_idx` ON `orders` (`type`);--> statement-breakpoint
CREATE INDEX `orders_buyer_email_idx` ON `orders` (`buyer_email`);--> statement-breakpoint
CREATE INDEX `orders_type_status_idx` ON `orders` (`type`,`status`);--> statement-breakpoint
CREATE INDEX `orders_status_expires_at_idx` ON `orders` (`status`,`expires_at`);--> statement-breakpoint
CREATE INDEX `orders_created_at_idx` ON `orders` (`created_at`);--> statement-breakpoint
ALTER TABLE `order_items` ADD `snapshot_bundle_products` text;