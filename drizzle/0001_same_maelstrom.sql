ALTER TABLE "user" ALTER COLUMN "featureFlags" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "featureFlags" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "featureFlags" SET NOT NULL;