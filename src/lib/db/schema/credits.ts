import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "./user";

export const creditTransaction = pgTable("credit_transaction", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // Positive for credits added, negative for credits used
  type: text("type").notNull(), // upgrade_plan, feature_use, admin_grant, etc.
  description: text("description"),
  metadata: text("metadata"), // JSON string for additional context
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
