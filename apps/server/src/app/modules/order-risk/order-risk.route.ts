import express from "express";
import {
  assessOrderRisk,
  getOrderRiskHistory,
  updateOrderRiskStatus,
} from "./order-risk.controller";

const router = express.Router();

router.post("/assess", assessOrderRisk);
router.post("/update-status", updateOrderRiskStatus);
router.post("/history", getOrderRiskHistory);

export const orderRiskRoutes = router;
