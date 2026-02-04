ALTER TABLE "user" ALTER COLUMN "credits" SET DEFAULT 10;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "paymentFailed" boolean DEFAULT false NOT NULL;