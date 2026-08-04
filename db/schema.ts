import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const demoUsers = sqliteTable("demo_users", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull().unique(),
  pinHash: text("pin_hash").notNull(),
  totalXp: integer("total_xp").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const learningSessions = sqliteTable("learning_sessions", {
  token: text("token").primaryKey(),
  userId: text("user_id").notNull().references(() => demoUsers.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
});

export const missionProgress = sqliteTable("mission_progress", {
  userId: text("user_id").notNull().references(() => demoUsers.id, { onDelete: "cascade" }),
  missionId: integer("mission_id").notNull(),
  status: text("status", { enum: ["in_progress", "completed"] }).notNull(),
  code: text("code").notNull(),
  attempts: integer("attempts").notNull().default(0),
  completedAt: text("completed_at"),
  updatedAt: text("updated_at").notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.missionId] })]);
