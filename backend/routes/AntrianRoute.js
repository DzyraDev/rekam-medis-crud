// src/routes/index.js
import express from "express";
import {
  createAntrian,
  getAntrian,
  getAntrianById,
  updateAntrian,
  deleteAntrian,
  getQueueCount,
  updateAntrianStatus,
} from "../controllers/Antrian.js";

import {
  verifyUser,
  adminOnly,
  doctorOnly,
  // patientOnly,
} from "../middleware/AuthUser.js";

const router = express.Router();

// Antrian Routes
router.post("/antrian", verifyUser, adminOnly, createAntrian);
router.get("/antrian", verifyUser, adminOnly, getAntrian);
router.get("/antrian/:id_antrian", verifyUser, adminOnly, getAntrianById);
router.patch("/antrian/:id_antrian", verifyUser, adminOnly, updateAntrian);
router.delete("/antrian/:id_antrian", verifyUser, adminOnly, deleteAntrian);
router.get("/antrian/count/:id_dokter", verifyUser, getQueueCount);
// New route for updating antrian status
router.put("/antrian/:id_antrian/status", verifyUser, adminOnly, updateAntrianStatus);

export default router;
