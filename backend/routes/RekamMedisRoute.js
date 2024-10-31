// src/routes/index.js
import express from "express";
import {
  verifyUser,
  adminOnly,
  doctorOnly,
  patientOnly,
} from "../middleware/AuthUser.js";
import {
  createRekamMedis,
  getRekamMedis,
  getRekamMedisById,
  updateRekamMedis,
  deleteRekamMedis,
  createRekamMedisFromAntrian,
} from "../controllers/RekamMedis.js";

const router = express.Router();

// Rekam Medis Routes
router.post("/rekam-medis", verifyUser, adminOnly, createRekamMedis);
router.get("/rekam-medis", verifyUser, adminOnly, getRekamMedis);
router.get(
  "/rekam-medis/:id_rekam_medis",
  verifyUser,
  adminOnly,
  getRekamMedisById
);
router.patch(
  "/rekam-medis/:id_rekam_medis",
  verifyUser,
  // doctorOnly,
  adminOnly,
  updateRekamMedis
);
router.delete("/rekam-medis/:id_rekam_medis", verifyUser, adminOnly, deleteRekamMedis);
// New route for creating rekam medis from antrian
router.post("/rekam-medis/create-from-antrian", verifyUser, adminOnly, createRekamMedisFromAntrian);


export default router;
