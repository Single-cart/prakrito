import { Request, Response } from "express";
import catchAsync from "../../middlewares/catchAsync";
import { orderRiskService } from "./order-risk.service";

// Helper function to get real client IP
const getRealClientIP = (req: Request): string => {
  // Check various headers that might contain the real IP
  const forwardedFor = req.headers["x-forwarded-for"];
  const realIP = req.headers["x-real-ip"];
  const cfConnectingIP = req.headers["cf-connecting-ip"]; // Cloudflare
  const trueClientIP = req.headers["true-client-ip"];
  const xClientIP = req.headers["x-client-ip"];

  let clientIP: string;

  // Try to get IP from various headers
  if (typeof forwardedFor === "string") {
    // X-Forwarded-For can contain multiple IPs, get the first one
    clientIP = forwardedFor.split(",")[0].trim();
  } else if (typeof realIP === "string") {
    clientIP = realIP;
  } else if (typeof cfConnectingIP === "string") {
    clientIP = cfConnectingIP;
  } else if (typeof trueClientIP === "string") {
    clientIP = trueClientIP;
  } else if (typeof xClientIP === "string") {
    clientIP = xClientIP;
  } else {
    // Fallback to connection remote address
    clientIP =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      "127.0.0.1";
  }

  // Clean up IPv6 mapped IPv4 addresses
  if (clientIP.startsWith("::ffff:")) {
    clientIP = clientIP.substring(7);
  }

  // Handle localhost/loopback addresses
  if (
    clientIP === "::1" ||
    clientIP === "127.0.0.1" ||
    clientIP === "localhost"
  ) {
    // In development, you might want to use a mock IP or the actual external IP
    // For production, this should rarely happen if properly configured
    if (process.env.NODE_ENV === "development") {
      // You can set a mock IP for development testing
      return process.env.MOCK_CLIENT_IP || "192.168.1.1";
    }
    // In production, log this as it might indicate a configuration issue
    console.warn(
      "Warning: Detected loopback IP in production. Check proxy configuration."
    );
  }

  return clientIP;
};

export const assessOrderRisk = catchAsync(
  async (req: Request, res: Response) => {
    const { phone, address, ip, email } = req.body;
    const clientIP = ip || getRealClientIP(req);

    const assessment = await orderRiskService.assessOrderRisk({
      phone,
      address,
      ip: clientIP,
      email,
    });

    res.status(200).json({
      success: true,
      assessment,
      detectedIP: clientIP, // Include detected IP for debugging
    });
  }
);

export const updateOrderRiskStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { orderId, phone, address, ip, email, status } = req.body;
    const clientIP = ip || getRealClientIP(req);

    await orderRiskService.updateOrderStatus(
      orderId,
      {
        phone,
        address,
        ip: clientIP,
        email,
      },
      status
    );

    res.status(200).json({
      success: true,
      message: "Order risk status updated successfully",
      detectedIP: clientIP,
    });
  }
);

export const getOrderRiskHistory = catchAsync(
  async (req: Request, res: Response) => {
    const { phone, address, ip, email } = req.body;
    const clientIP = ip || getRealClientIP(req);

    const history = await orderRiskService.getOrderHistory({
      phone,
      address,
      ip: clientIP,
      email,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "No order history found",
        detectedIP: clientIP,
      });
    }

    res.status(200).json({
      success: true,
      history,
      detectedIP: clientIP,
    });
  }
);
