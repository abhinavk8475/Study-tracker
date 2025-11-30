import { pgTable, text, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const subjectsTable = pgTable("subjects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
});

export const studySessionsTable = pgTable("study_sessions", {
  id: text("id").primaryKey(),
  subjectId: text("subject_id").notNull(),
  duration: integer("duration").notNull(),
  date: date("date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  notes: text("notes"),
});

export type Subject = typeof subjectsTable.$inferSelect;
export type InsertSubject = typeof subjectsTable.$inferInsert;

export type StudySession = typeof studySessionsTable.$inferSelect;
export type InsertStudySession = typeof studySessionsTable.$inferInsert;

export const insertSubjectSchema = createInsertSchema(subjectsTable);
export const insertStudySessionSchema = createInsertSchema(studySessionsTable);

export interface OverallStats {
  todayDuration: number;
  weekDuration: number;
  monthDuration: number;
  totalDuration: number;
  totalSessions: number;
  currentStreak: number;
  topSubjects: Array<{ name: string; duration: number; color: string }>;
}

export interface DailyStats {
  date: string;
  duration: number;
  sessions: number;
}

export interface SubjectStats {
  subjectId: string;
  name: string;
  color: string;
  totalDuration: number;
  sessions: number;
}
