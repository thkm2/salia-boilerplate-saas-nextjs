CREATE TABLE "file" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"key" text NOT NULL,
	"filename" text NOT NULL,
	"contentType" text NOT NULL,
	"size" integer NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"uploadedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "file_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;