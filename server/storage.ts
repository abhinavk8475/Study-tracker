import type { StudySession, Subject, InsertStudySession, InsertSubject, OverallStats, DailyStats, SubjectStats } from "@shared/schema";

export interface IStorage {
  // Sessions
  createSession(session: InsertStudySession): Promise<StudySession>;
  getSession(id: string): Promise<StudySession | undefined>;
  getSessions(): Promise<StudySession[]>;
  updateSession(id: string, session: Partial<StudySession>): Promise<StudySession | undefined>;
  deleteSession(id: string): Promise<void>;

  // Subjects
  createSubject(subject: InsertSubject): Promise<Subject>;
  getSubject(id: string): Promise<Subject | undefined>;
  getSubjects(): Promise<Subject[]>;
  updateSubject(id: string, subject: Partial<Subject>): Promise<Subject | undefined>;
  deleteSubject(id: string): Promise<void>;

  // Stats
  getOverallStats(): Promise<OverallStats>;
  getWeeklyStats(): Promise<DailyStats[]>;
  getSubjectStats(subjectId: string): Promise<SubjectStats | undefined>;
}

class MemStorage implements IStorage {
  private sessions: Map<string, StudySession> = new Map();
  private subjects: Map<string, Subject> = new Map();

  constructor() {
    const defaultSubjects: Subject[] = [
      { id: "1", name: "Mathematics", color: "#3b82f6" },
      { id: "2", name: "Science", color: "#ef4444" },
      { id: "3", name: "History", color: "#f59e0b" },
      { id: "4", name: "English", color: "#8b5cf6" },
      { id: "5", name: "Programming", color: "#10b981" },
    ];

    defaultSubjects.forEach(subject => {
      this.subjects.set(subject.id, subject);
    });
  }

  // Sessions
  async createSession(session: InsertStudySession): Promise<StudySession> {
    const id = Date.now().toString();
    const newSession = { ...session, id } as StudySession;
    this.sessions.set(id, newSession);
    return newSession;
  }

  async getSession(id: string): Promise<StudySession | undefined> {
    return this.sessions.get(id);
  }

  async getSessions(): Promise<StudySession[]> {
    return Array.from(this.sessions.values());
  }

  async updateSession(id: string, session: Partial<StudySession>): Promise<StudySession | undefined> {
    const existing = this.sessions.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...session };
    this.sessions.set(id, updated);
    return updated;
  }

  async deleteSession(id: string): Promise<void> {
    this.sessions.delete(id);
  }

  // Subjects
  async createSubject(subject: InsertSubject): Promise<Subject> {
    const id = Date.now().toString();
    const newSubject = { ...subject, id } as Subject;
    this.subjects.set(id, newSubject);
    return newSubject;
  }

  async getSubject(id: string): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async updateSubject(id: string, subject: Partial<Subject>): Promise<Subject | undefined> {
    const existing = this.subjects.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...subject };
    this.subjects.set(id, updated);
    return updated;
  }

  async deleteSubject(id: string): Promise<void> {
    this.subjects.delete(id);
  }

  // Stats
  private calculateDayStreak(): number {
    const sessions = Array.from(this.sessions.values());
    if (sessions.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedSessions = sessions
      .map(s => new Date(s.date))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let currentDate = new Date(today);

    for (const sessionDate of sortedSessions) {
      sessionDate.setHours(0, 0, 0, 0);

      if (sessionDate.getTime() === currentDate.getTime()) {
        if (streak === 0) streak = 1;
      } else if (sessionDate.getTime() === currentDate.getTime() - 24 * 60 * 60 * 1000) {
        streak++;
        currentDate = new Date(sessionDate);
      } else {
        break;
      }
    }

    return streak;
  }

  async getOverallStats(): Promise<OverallStats> {
    const sessions = Array.from(this.sessions.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    let todayDuration = 0;
    let weekDuration = 0;
    let monthDuration = 0;
    let totalDuration = 0;

    const subjectDurations: Record<string, { name: string; duration: number; color: string }> = {};

    sessions.forEach(session => {
      totalDuration += session.duration;

      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      if (sessionDate.getTime() === today.getTime()) {
        todayDuration += session.duration;
      }

      if (sessionDate >= weekAgo) {
        weekDuration += session.duration;
      }

      if (sessionDate >= monthAgo) {
        monthDuration += session.duration;
      }

      const subject = this.subjects.get(session.subjectId);
      if (subject) {
        if (!subjectDurations[session.subjectId]) {
          subjectDurations[session.subjectId] = {
            name: subject.name,
            duration: 0,
            color: subject.color,
          };
        }
        subjectDurations[session.subjectId].duration += session.duration;
      }
    });

    const topSubjects = Object.values(subjectDurations)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    return {
      todayDuration,
      weekDuration,
      monthDuration,
      totalDuration,
      totalSessions: sessions.length,
      currentStreak: this.calculateDayStreak(),
      topSubjects,
    };
  }

  async getWeeklyStats(): Promise<DailyStats[]> {
    const sessions = Array.from(this.sessions.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats: Record<string, DailyStats> = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      stats[dateStr] = {
        date: dateStr,
        duration: 0,
        sessions: 0,
      };
    }

    sessions.forEach(session => {
      const dateStr = session.date;
      if (stats[dateStr]) {
        stats[dateStr].duration += session.duration;
        stats[dateStr].sessions += 1;
      }
    });

    return Object.values(stats);
  }

  async getSubjectStats(subjectId: string): Promise<SubjectStats | undefined> {
    const subject = this.subjects.get(subjectId);
    if (!subject) return undefined;

    const sessions = Array.from(this.sessions.values())
      .filter(s => s.subjectId === subjectId);

    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

    return {
      subjectId,
      name: subject.name,
      color: subject.color,
      totalDuration,
      sessions: sessions.length,
    };
  }
}

export const storage = new MemStorage();
