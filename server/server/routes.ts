import express from "express";
import { storage } from "./storage";
import { insertStudySessionSchema, insertSubjectSchema } from "@shared/schema";

export function createRoutes() {
  const router = express.Router();

  // Sessions
  router.post("/sessions", async (req, res) => {
    try {
      const validated = insertStudySessionSchema.parse(req.body);
      const session = await storage.createSession(validated);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  router.get("/sessions", async (req, res) => {
    const sessions = await storage.getSessions();
    res.json(sessions);
  });

  router.get("/sessions/:id", async (req, res) => {
    const session = await storage.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: "Not found" });
    res.json(session);
  });

  router.patch("/sessions/:id", async (req, res) => {
    try {
      const session = await storage.updateSession(req.params.id, req.body);
      if (!session) return res.status(404).json({ error: "Not found" });
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid data" });
    }
  });

  router.delete("/sessions/:id", async (req, res) => {
    await storage.deleteSession(req.params.id);
    res.json({ success: true });
  });

  // Subjects
  router.post("/subjects", async (req, res) => {
    try {
      const validated = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(validated);
      res.json(subject);
    } catch (error) {
      res.status(400).json({ error: "Invalid subject data" });
    }
  });

  router.get("/subjects", async (req, res) => {
    const subjects = await storage.getSubjects();
    res.json(subjects);
  });

  router.get("/subjects/:id", async (req, res) => {
    const subject = await storage.getSubject(req.params.id);
    if (!subject) return res.status(404).json({ error: "Not found" });
    res.json(subject);
  });

  router.patch("/subjects/:id", async (req, res) => {
    try {
      const subject = await storage.updateSubject(req.params.id, req.body);
      if (!subject) return res.status(404).json({ error: "Not found" });
      res.json(subject);
    } catch (error) {
      res.status(400).json({ error: "Invalid data" });
    }
  });

  router.delete("/subjects/:id", async (req, res) => {
    await storage.deleteSubject(req.params.id);
    res.json({ success: true });
  });

  // Stats
  router.get("/stats", async (req, res) => {
    const stats = await storage.getOverallStats();
    res.json(stats);
  });

  router.get("/stats/weekly", async (req, res) => {
    const stats = await storage.getWeeklyStats();
    res.json(stats);
  });

  router.get("/stats/subject/:id", async (req, res) => {
    const stats = await storage.getSubjectStats(req.params.id);
    if (!stats) return res.status(404).json({ error: "Not found" });
    res.json(stats);
  });

  return router;
}
