import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  cnic: text("cnic").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  program: text("program").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).pick({
  fullName: true,
  cnic: true,
  email: true,
  phone: true,
  address: true,
  program: true,
}).extend({
  fullName: z.string().min(1, "Full name is required"),
  cnic: z.string().regex(/^\d{13}$/, "CNIC must be exactly 13 digits"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  address: z.string().min(1, "Address is required"),
  program: z.string().min(1, "Please select a program"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
