import express from "express";
import {getDrugList,getDrug,editQuantity,decreaseDebt,increaseDebt,changeArrivalPrice,changeSalePrice} from "../controllers/drugs.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/tum-ilaclar",verifyToken,getDrugList);
router.get("/:id",verifyToken,getDrug);

router.patch("/miktar-guncelleme",verifyToken,editQuantity)

router.patch("/borc-arttir/:id",verifyToken,increaseDebt)
router.patch("/borc-azalt/:id",verifyToken,decreaseDebt)
router.patch("/:id/:arrivalPrice",verifyToken,changeArrivalPrice)
router.patch("/:id/:salePrice",verifyToken,changeSalePrice)


export default router;