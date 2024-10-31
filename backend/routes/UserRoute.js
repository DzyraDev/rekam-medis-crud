import express from "express";
import {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/Users.js";
import { verifyUser } from "../middleware/AuthUser.js";
import { adminOnly } from "../middleware/AuthUser.js";


const router = express.Router(); // Corrected line

router.get("/users", verifyUser,adminOnly, getUser);
router.get("/users/:id_user",verifyUser,adminOnly, getUserById ); // Corrected route parameter syntax
router.post("/users", createUser );
router.patch("/users/:uuid", verifyUser, adminOnly , updateUser);
router.delete("/users/:uuid", verifyUser, adminOnly, deleteUser);

export default router; // Corrected export statement
