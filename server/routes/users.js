import express from "express";
import {getUser,getActivities,newActivities} from "../controllers/users.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.get("/:id",verifyToken,getUser)
router.get("/:id/activities",verifyToken,getActivities)


router.patch("/:id/:activityCode",verifyToken,newActivities)

export default router;