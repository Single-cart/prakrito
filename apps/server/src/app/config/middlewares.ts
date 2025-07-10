import compression from "compression";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import ejs from "ejs";
import express, { Application } from "express";
import mongoSanitize from "express-mongo-sanitize";
import userAgent from "express-useragent";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import path from "path";
import requestIp from "request-ip";
import {
  configureProxySupport,
  ipLoggingMiddleware,
} from "../config/proxy.config";
import enableCrossOriginResourcePolicy from "../middlewares/enableCrossOriginResourcePolicy";
import sendResponse from "../utils/sendResponse";
import config from "./config";

const middlewares = (app: Application) => {
  const corsOptions: CorsOptions = {
    origin:
      config.app.env === "production"
        ? config.cors.allowedOrigins
        : ["http://localhost:3003", "http://localhost:3000"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  };

  // Configure enhanced proxy support for better IP detection
  configureProxySupport(app);

  // Middlewares
  app.set("view engine", ejs);
  // app.use(session(sessionOptions));
  app.use("/public", express.static("public"));
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(
    compression({
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
          return false;
        }
        return compression.filter(req, res);
      },
      level: 6,
      threshold: 100 * 1000, // 100kb
    })
  );
  app.use(cookieParser());
  app.use(userAgent.express());
  app.use(requestIp.mw());

  // Add IP logging middleware for debugging (development only)
  if (config.app.env === "development") {
    app.use(ipLoggingMiddleware);
    app.use(morgan("dev"));
  }

  app.use(mongoSanitize()); // Prevent NoSQL injections
  app.use(hpp()); // Prevent HTTP Parameter Pollution

  //swagger api middleware
  // setupSwagger(app, swaggerConfigs);

  // Root route
  app.get("/", (_, res) => {
    sendResponse(res, {
      statusCode: 200,
      message: "Server running successfully.",
    });
  });

  // IP detection test endpoint (useful for debugging)
  app.get("/test-ip", (req, res) => {
    res.json({
      "req.ip": req.ip,
      "req.connection.remoteAddress": req.connection.remoteAddress,
      "x-forwarded-for": req.headers["x-forwarded-for"],
      "x-real-ip": req.headers["x-real-ip"],
      "cf-connecting-ip": req.headers["cf-connecting-ip"],
      "user-agent": req.headers["user-agent"],
      "request-ip": (req as any).clientIp, // from request-ip middleware
      "all-headers": Object.keys(req.headers)
        .filter((h) => h.includes("ip") || h.includes("forward"))
        .reduce((obj: any, key) => {
          obj[key] = req.headers[key];
          return obj;
        }, {}),
    });
  });

  // static files
  const uploadsPath = path.join(__dirname, "..", "public/uploads");
  app.use(
    "/public/uploads",
    enableCrossOriginResourcePolicy,
    express.static(uploadsPath)
  );
};

export default middlewares;
