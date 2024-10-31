
import express from "express";

// src/routes/index.js
import { verifyUser, adminOnly, doctorOnly } from "../middleware/AuthUser.js";

import {
  createDokter,
  getDokters,
  getDokter,
  updateDokter,
  deleteDokter,
} from "../controllers/Dokter.js";

const router = express.Router();

// Dokter Routes
router.post("/dokter", verifyUser, adminOnly, createDokter);
router.get("/dokter", verifyUser, adminOnly, getDokters);
router.get("/dokter/:id", verifyUser, adminOnly, getDokter);
router.patch("/dokter/:id", verifyUser, adminOnly, updateDokter);
router.delete("/dokter/:id", verifyUser, adminOnly, deleteDokter);
// router.get("/dokter/me", verifyUser, Me);

export default router;