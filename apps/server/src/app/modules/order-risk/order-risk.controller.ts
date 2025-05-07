import { Request, Response } from "express";
import catchAsync from "../../middlewares/catchAsync";
import { orderRiskService } from "./order-risk.service";

export const assessOrderRisk = catchAsync(
  async (req: Request, res: Response) => {
    const { phone, address, ip, email } = req.body;

    const assessment = await orderRiskService.assessOrderRisk({
      phone,
      address,
      ip: ip || req.ip,
      email,
    });

    res.status(200).json({
      success: true,
      assessment,
    });
  }
);

export const updateOrderRiskStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { orderId, phone, address, ip, email, status } = req.body;

    await orderRiskService.updateOrderStatus(
      orderId,
      {
        phone,
        address,
        ip: ip || req.ip,
        email,
      },
      status
    );

    res.status(200).json({
      success: true,
      message: "Order risk status updated successfully",
    });
  }
);

export const getOrderRiskHistory = catchAsync(
  async (req: Request, res: Response) => {
    const { phone, address, ip, email } = req.body;

    const history = await orderRiskService.getOrderHistory({
      phone,
      address,
      ip: ip || req.ip,
      email,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "No order history found",
      });
    }

    res.status(200).json({
      success: true,
      history,
    });
  }
);
