CREATE TABLE "feature_flag" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feature_flag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_feature_flag" (
	"userId" text NOT NULL,
	"flagId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_feature_flag_userId_flagId_pk" PRIMARY KEY("userId","flagId")
);
--> statement-breakpoint
ALTER TABLE "user_feature_flag" ADD CONSTRAINT "user_feature_flag_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_feature_flag" ADD CONSTRAINT "user_feature_flag_flagId_feature_flag_id_fk" FOREIGN KEY ("flagId") REFERENCES "public"."feature_flag"("id") ON DELETE cascade ON UPDATE no action;