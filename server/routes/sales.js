import express from "express"
import {getSalesWithPrescription,getSalesWithoutPrescription,editSales,getOnCreditList,newSale,getDebtList,closeOnCredit} from "../controllers/sales.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router();

router.get("/receteli-satis",verifyToken,getSalesWithPrescription)
router.get("/recetesiz-satis",verifyToken,getSalesWithoutPrescription)
router.get("/borc-bilgi",verifyToken,getDebtList)
router.get("/veresiye-bilgi",verifyToken,getOnCreditList)

router.patch("/recetesiz-satis/:id/duzenle",verifyToken,editSales)
router.patch("/receteli-satis/:id/duzenle",verifyToken,editSales)
router.patch("/veresiye-kapat/:id",verifyToken,closeOnCredit)


router.post("/yeni-satis",verifyToken,newSale);

export default router;