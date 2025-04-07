import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getHKClinics, getNGOClinics, getSZClinics, getAllClinics } from "./clinic-data";

export async function registerRoutes(app: Express): Promise<Server> {
  // 牙科診所資料API
  app.get('/api/hk-clinics', getHKClinics);
  app.get('/api/ngo-clinics', getNGOClinics);
  app.get('/api/sz-clinics', getSZClinics);
  app.get('/api/clinics', getAllClinics);

  // 其他API範例
  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
