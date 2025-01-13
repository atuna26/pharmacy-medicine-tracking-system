import express from "express";
import {getPrescription,getPrescriptionList,editPrescription} from "../controllers/prescriptions.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/",verifyToken,getPrescriptionList)
router.get("/:id",verifyToken,getPrescription)

router.patch("/:id/duzenle",verifyToken,editPrescription)

export default router;
