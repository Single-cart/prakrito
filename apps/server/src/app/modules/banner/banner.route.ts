import express from "express";
import { authorizeUser, isAuthenticated } from "../../middlewares/authGuards";
import { fileUploader } from "../../middlewares/uploadFile";
import {
  createBanner,
  deleteBanner,
  getActiveBanners,
  getAllBanners,
  getSingleBanner,
  updateBanner,
} from "./banner.controller";

const bannerRoute = express.Router();

bannerRoute.post(
  "/create-banner",
  isAuthenticated,
  authorizeUser("admin"),
  fileUploader("public/uploads/banners", "fields", [
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  createBanner
);
bannerRoute.put(
  "/update-banner/:id",
  isAuthenticated,
  authorizeUser("admin"),
  fileUploader("public/uploads/banners", "fields", [
    { name: "desktopImage", maxCount: 1 },
    { name: "mobileImage", maxCount: 1 },
  ]),
  updateBanner
);
bannerRoute.get(
  "/get-all-banners",
  isAuthenticated,
  authorizeUser("admin"),
  getAllBanners
);
bannerRoute.get("/get-active-banners", getActiveBanners);
bannerRoute.get("/get-single-banner/:id", getSingleBanner);
bannerRoute.delete(
  "/delete-banner/:id",
  isAuthenticated,
  authorizeUser("admin"),
  deleteBanner
);

export default bannerRoute;
