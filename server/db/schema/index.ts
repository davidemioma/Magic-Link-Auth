import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum("userRole", ["admin", "user"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  image: text("image"),
  email: text("email").unique().notNull(),
  role: userRole("userRole").default("user"),
});

export const magicLinkTokens = pgTable("magic_link_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires"),
});

export const emailChangeVerificationTokens = pgTable(
  "email_change_verification_tokens",
  {
    id: serial("id").primaryKey(),
    oldEmail: text("old_email").unique().notNull(),
    newEmail: text("new_email").unique().notNull(),
    token: text("token").unique().notNull(),
    expires: timestamp("expires"),
  }
);
