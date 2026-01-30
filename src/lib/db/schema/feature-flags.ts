import { pgTable, text, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { user } from "./user";

export const featureFlag = pgTable("feature_flag", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	description: text("description"),
	enabled: boolean("enabled").notNull().default(true),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const userFeatureFlag = pgTable(
	"user_feature_flag",
	{
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		flagId: text("flagId")
			.notNull()
			.references(() => featureFlag.id, { onDelete: "cascade" }),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.flagId] })],
);
