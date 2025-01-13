import express from "express";
import {getTransactionList,newTransaction,editTransaction} from "../controllers/transactions.js"
import { verifyToken} from "../middleware/auth.js";

const router = express.Router();

router.get("/tum-hareketler",verifyToken,getTransactionList);

router.patch("/:id/hareket-duzenle",verifyToken,editTransaction)

router.post("/yeni-hareket",verifyToken,newTransaction)

export default router