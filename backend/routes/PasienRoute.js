// src/routes/index.js
import express from "express";
import {
  createPasien,
  getPasiens,
  getPasien,
  updatePasien,
  deletePasien,
} from "../controllers/Pasien.js";


import { verifyUser, adminOnly, patientOnly } from "../middleware/AuthUser.js";

const router = express.Router();

// Pasien Routes
router.post("/pasien", verifyUser, adminOnly, createPasien);
router.get("/pasien", verifyUser, adminOnly, getPasiens);
router.get("/pasien/:id_pasien", verifyUser, adminOnly, getPasien);
router.patch("/pasien/:id", verifyUser, adminOnly, updatePasien);
router.delete("/pasien/:id", verifyUser, adminOnly, deletePasien);


export default router;
