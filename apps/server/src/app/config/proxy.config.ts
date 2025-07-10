import { Application } from "express";

/**
 * Configure Express to properly handle proxy headers
 * This is essential for getting real client IPs when behind a proxy/load balancer
 */
export const configureProxySupport = (app: Application): void => {
  // Trust proxy settings
  // In production, set this to the number of proxy layers or specific IP ranges
  if (process.env.NODE_ENV === "production") {
    // Option 1: Trust first proxy (if you have one reverse proxy)
    app.set("trust proxy", 1);

    // Option 2: Trust specific IP ranges (recommended for production)
    // app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

    // Option 3: Trust specific proxy IPs
    // app.set('trust proxy', ['127.0.0.1', '::1', 'your-proxy-ip']);

    // Option 4: Trust all proxies (use with caution)
    // app.set('trust proxy', true);
  } else {
    // Development: trust all proxies for ease of development
    app.set("trust proxy", true);
  }
};

/**
 * Middleware to log IP detection for debugging
 */
export const ipLoggingMiddleware = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV === "development") {
    console.log("IP Detection Debug:", {
      "req.ip": req.ip,
      "req.connection.remoteAddress": req.connection.remoteAddress,
      "x-forwarded-for": req.headers["x-forwarded-for"],
      "x-real-ip": req.headers["x-real-ip"],
      "cf-connecting-ip": req.headers["cf-connecting-ip"],
      "user-agent": req.headers["user-agent"],
    });
  }
  next();
};

/**
 * Production deployment notes:
 *
 * 1. Nginx Configuration:
 *    Add these lines to your nginx.conf:
 *    ```
 *    proxy_set_header X-Real-IP $remote_addr;
 *    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 *    proxy_set_header X-Forwarded-Proto $scheme;
 *    proxy_set_header Host $host;
 *    ```
 *
 * 2. Apache Configuration:
 *    Enable mod_remoteip and add:
 *    ```
 *    RemoteIPHeader X-Forwarded-For
 *    RemoteIPInternalProxy your-proxy-ip
 *    ```
 *
 * 3. Cloudflare:
 *    Cloudflare automatically adds CF-Connecting-IP header
 *    Make sure to restore real visitor IPs in your Cloudflare settings
 *
 * 4. AWS ALB/ELB:
 *    Application Load Balancer automatically adds X-Forwarded-For
 *    Make sure connection draining is properly configured
 *
 * 5. Docker/Kubernetes:
 *    If using ingress controllers, ensure they're configured to pass real IPs
 *    For NGINX Ingress: use-forwarded-headers: "true"
 */
