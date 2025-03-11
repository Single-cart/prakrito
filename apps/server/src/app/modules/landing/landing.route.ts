import express from "express";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuards";
import validateRequest from "../../middlewares/validateRequest";
import * as landingController from "./landing.controller";
import { landingValidation } from "./landing.validation";

const landingRoutes = express.Router();

// Create landing page
landingRoutes.post(
  "/",
  isAuthenticated,
  authorizeUser("admin"),
  validateRequest(landingValidation.createLandingZodSchema),
  landingController.createLanding
);

// Get all landing pages with filters and pagination
landingRoutes.get("/", landingController.getAllLandings);

// Get single landing page
landingRoutes.get("/:id", landingController.getSingleLanding);

// Update landing page
landingRoutes.patch(
  "/:id",
  isAuthenticated,
  authorizeUser("admin"),
  validateRequest(landingValidation.updateLandingZodSchema),
  landingController.updateLanding
);

// Delete landing page
landingRoutes.delete(
  "/:id",
  isAuthenticated,
  authorizeUser("admin"),
  landingController.deleteLanding
);

export default landingRoutes;
