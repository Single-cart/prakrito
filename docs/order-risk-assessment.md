# Order Risk Assessment Feature

## Overview

The Order Risk Assessment feature helps identify potentially fraudulent or high-risk orders by analyzing customer behavior patterns and order history.

## Components

### Backend (Server)

- **Location**: `apps/server/src/app/modules/order/order.controller.ts` (integrated)
- **Location**: `apps/server/src/app/modules/order-risk/` (risk assessment logic)
- **API Integration**:
  - `GET /order/single-order/:id` - Returns order with risk assessment
  - `PUT /order/update-order-status/:id` - Updates order status and risk history
  - `POST /order/create-order` - Creates order with initial risk assessment

### Frontend (Admin)

- **Location**: `apps/admin/app/(dashboard)/order/[id]/page.tsx`
- **Features**:
  - Risk assessment card in order details
  - Automatic risk assessment when viewing orders
  - Manual risk assessment and history retrieval
  - Visual risk indicators (LOW/MEDIUM/HIGH)

## Risk Assessment Logic

### Risk Factors

- **Cancellation Rate**: Higher cancellation rates increase risk score
- **Order Volume**: High volume with significant cancellations
- **Recent Cancellations**: Recent cancelled orders add to risk
- **IP/Phone/Address Matching**: Tracks behavior across identifiers

### Risk Levels

- **LOW (0-39)**: Green - Low risk customer
- **MEDIUM (40-69)**: Yellow - Moderate risk, monitor closely
- **HIGH (70-100)**: Red - High risk, requires attention

## API Usage

### Get Single Order (with Risk Assessment)

```typescript
GET /order/single-order/:id

Response:
{
  "success": true,
  "message": "Order retrieved successfully",
  "order": {
    // Order data
  },
  "riskAssessment": {
    "riskScore": 25,
    "riskLevel": "LOW",
    "reasons": [],
    "history": {
      "totalOrders": 5,
      "cancelledOrders": 1,
      "successfulOrders": 4
      // ... more history data
    }
  }
}
```

### Update Order Status (with Risk Tracking)

```typescript
PUT /order/update-order-status/:id
{
  "orderStatus": "Delivered"
}

// Risk assessment is automatically updated in the background
```

### Create Order (with Risk Assessment)

```typescript
POST / order / create - order;
{
  // Order data including shipping info
}

// Returns order with initial risk assessment
```

## Database Schema

### OrderRiskHistory Collection

```typescript
{
  totalOrders: number;
  cancelledOrders: number;
  successfulOrders: number;
  lastOrderDate?: Date;
  lastOrderStatus?: string;
  riskScore: number; // 0-100
  identifiers: {
    phone?: string;
    address?: string;
    ip: string;
    email?: string;
  };
  orderIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Integration

### Order Status Updates

When an order status changes, the system automatically:

1. Updates the risk history
2. Recalculates the risk score
3. Tracks the order in the customer's history

### Admin Dashboard

The order details page includes:

- Risk assessment card with current risk level
- Risk factors and reasoning
- Order history statistics
- Manual assessment buttons

## Features

### Integrated Assessment

- Risk assessment is automatically included when fetching order details
- Uses customer's shipping information (phone, address, email)
- Displays risk level and score immediately
- Updates automatically when order status changes

### Manual Controls

- **Refresh Assessment**: Manually refresh risk assessment data
- Visual indicators for risk levels
- Real-time updates when order status changes

### Risk Tracking

- Tracks orders across multiple identifiers
- Maintains historical data for pattern analysis
- Provides reasoning for risk assessments

## Future Enhancements

1. **Machine Learning Integration**

   - Advanced pattern recognition
   - Anomaly detection
   - Predictive risk scoring

2. **Additional Risk Factors**

   - Device fingerprinting
   - Geographic analysis
   - Time-based patterns
   - Payment method analysis

3. **Real-time Alerts**

   - High-risk order notifications
   - Automated flagging system
   - Integration with fraud prevention tools

4. **Reporting Dashboard**
   - Risk analytics
   - Trend analysis
   - Performance metrics
