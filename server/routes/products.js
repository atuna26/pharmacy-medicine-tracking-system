import express from "express"
import {getProductList,getProduct,increaseQuantity,decreaseQuantity,changeArrivalPrice,changeSalePrice,newProduct} from "../controllers/products.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router();

router.get("/tum-urunler",verifyToken,getProductList);
router.get("/:id",verifyToken,getProduct);

router.patch("/miktar-arttir/:id",verifyToken,increaseQuantity)
router.patch("/miktar-azalt/:id",verifyToken,decreaseQuantity)
router.patch("/:id/:arrivalPrice",verifyToken,changeArrivalPrice)
router.patch("/:id/:salePrice",verifyToken,changeSalePrice)

router.post("/yeni-urun",verifyToken,newProduct)

export default router;