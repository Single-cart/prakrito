import express, { Application } from "express";
import os from "os";
import globalErrorhandler from "./app/middlewares/globalErrorHandler";
import { notFoundRoute } from "./app/middlewares/notFoundRoute";

import middlewares from "./app/config/middlewares";
import router from "./app/routes";
const app: Application = express();

//all middlewares
middlewares(app);

app.get("/health", async (req, res) => {
  const healthcheck = {
    status: "ok",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    timestamp: Date.now(),
    memory: {
      free: os.freemem(),
      total: os.totalmem(),
    },
  };

  res.json(healthcheck);
});

// api endpoints
app.use("/api/v1", router);

// Global error handler
app.use(globalErrorhandler);

// handle not found route
app.use(notFoundRoute);

export default app;
