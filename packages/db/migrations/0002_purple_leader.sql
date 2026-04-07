CREATE TABLE `config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`snapshot_name` text NOT NULL,
	`snapshot_price` integer NOT NULL,
	`snapshot_type` text NOT NULL,
	`snapshot_variants` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `order_items_order_id_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`buyer_name` text NOT NULL,
	`buyer_email` text NOT NULL,
	`buyer_phone` text NOT NULL,
	`buyer_college` text NOT NULL,
	`total_price` integer NOT NULL,
	`idempotency_key` text,
	`expires_at` text,
	`paid_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`payment_method` text,
	`midtrans_order_id` text,
	`proof_image_url` text,
	`verified_by` text,
	`verified_at` text,
	`rejection_reason` text,
	`refund_token` text,
	`picked_up_at` text,
	`picked_up_by` text,
	FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`picked_up_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_idempotencyKey_unique` ON `orders` (`idempotency_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_refundToken_unique` ON `orders` (`refund_token`);--> statement-breakpoint
CREATE INDEX `orders_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `orders_type_idx` ON `orders` (`type`);--> statement-breakpoint
CREATE INDEX `orders_buyer_email_idx` ON `orders` (`buyer_email`);--> statement-breakpoint
CREATE INDEX `orders_type_status_idx` ON `orders` (`type`,`status`);--> statement-breakpoint
CREATE INDEX `orders_status_expires_at_idx` ON `orders` (`status`,`expires_at`);--> statement-breakpoint
CREATE INDEX `orders_created_at_idx` ON `orders` (`created_at`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`stock` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`image_url` text,
	`variants` text,
	`bundle_items` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `products_type_idx` ON `products` (`type`);--> statement-breakpoint
CREATE INDEX `products_is_active_idx` ON `products` (`is_active`);--> statement-breakpoint
CREATE INDEX `products_type_is_active_idx` ON `products` (`type`,`is_active`);--> statement-breakpoint
CREATE TABLE `refund_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`status` text NOT NULL,
	`reason` text NOT NULL,
	`payment_method` text NOT NULL,
	`payment_proof_url` text,
	`bank_account_number` text NOT NULL,
	`bank_name` text NOT NULL,
	`bank_account_holder` text NOT NULL,
	`processed_by` text,
	`processed_at` text,
	`rejection_reason` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`processed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `refund_requests_order_id_idx` ON `refund_requests` (`order_id`);--> statement-breakpoint
CREATE INDEX `refund_requests_status_idx` ON `refund_requests` (`status`);--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`order_item_id` text NOT NULL,
	`qr_code` text NOT NULL,
	`event_day` text NOT NULL,
	`attendance_status` text DEFAULT 'not_checked_in' NOT NULL,
	`checked_in_at` text,
	`checked_in_by` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) NOT NULL,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`checked_in_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tickets_qrCode_unique` ON `tickets` (`qr_code`);--> statement-breakpoint
CREATE INDEX `tickets_qr_code_idx` ON `tickets` (`qr_code`);--> statement-breakpoint
CREATE INDEX `tickets_event_day_idx` ON `tickets` (`event_day`);--> statement-breakpoint
CREATE INDEX `tickets_event_day_attendance_status_idx` ON `tickets` (`event_day`,`attendance_status`);--> statement-breakpoint
CREATE INDEX `tickets_order_item_id_idx` ON `tickets` (`order_item_id`);