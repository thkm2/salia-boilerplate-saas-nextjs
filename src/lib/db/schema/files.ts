import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "./user";

export const file = pgTable("file", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  key: text("key").notNull().unique(), // R2 storage key
  filename: text("filename").notNull(), // Original filename
  contentType: text("contentType").notNull(), // MIME type
  size: integer("size").notNull(), // Size in bytes
  uploadedAt: timestamp("uploadedAt").notNull().defaultNow(),
});
