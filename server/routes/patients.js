import express from "express";
import {getPatient,getPatientList,getPatientPrescription,setPatientData,newPatient} from "../controllers/patients.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/",verifyToken,getPatientList)
router.get("/:id",verifyToken,getPatient)
router.get("/:id/gecmis-raporlar",verifyToken,getPatientPrescription)

router.post("/yeni-hasta",verifyToken,newPatient)
router.patch("/:id/duzenle",verifyToken,setPatientData)

export default router;