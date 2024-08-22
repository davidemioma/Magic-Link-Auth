CREATE TABLE IF NOT EXISTS "magic_link_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp,
	CONSTRAINT "magic_link_tokens_email_unique" UNIQUE("email"),
	CONSTRAINT "magic_link_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DROP TABLE "password_reset_tokens";--> statement-breakpoint
DROP TABLE "two_factor_confirmations";--> statement-breakpoint
DROP TABLE "two_factor_tokens";--> statement-breakpoint
DROP TABLE "verification_tokens";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "email_verified";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "hashed_password";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "isTwoFactorEnabled";