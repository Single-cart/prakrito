# Improved IP Detection Setup Guide

## Overview

The enhanced risk order detection system now includes sophisticated IP detection that properly handles proxy servers, load balancers, and various deployment scenarios.

## What was enhanced:

### 1. Enhanced IP Detection Logic

- **Multiple Header Support**: Checks `X-Forwarded-For`, `X-Real-IP`, `CF-Connecting-IP`, `True-Client-IP`, and `X-Client-IP`
- **IPv6 Cleanup**: Properly handles IPv6-mapped IPv4 addresses (`::ffff:127.0.0.1` → `127.0.0.1`)
- **Loopback Detection**: Identifies and handles localhost addresses
- **Development vs Production**: Different handling for development and production environments

### 2. Geolocation Integration

- **IP Geolocation Service**: Automatically looks up location data for detected IPs
- **VPN/Proxy Detection**: Identifies when orders are placed through VPNs or proxies
- **Risk Scoring**: Adds geolocation-based risk factors to the assessment
- **Caching**: Intelligent caching to avoid repeated API calls

### 3. Enhanced Risk Assessment

- **Geolocation Risk Factors**: VPN usage, proxy detection, high-risk locations
- **Updated Recommendations**: Specific actions based on detected risks
- **Model Versioning**: Updated to v1.1.0 with geolocation support

## Implementation Steps:

### Step 1: Express App Configuration

Add this to your main Express app file:

```typescript
import {
  configureProxySupport,
  ipLoggingMiddleware,
} from "./config/proxy.config";

const app = express();

// Configure proxy support
configureProxySupport(app);

// Add IP logging middleware (optional, for debugging)
if (process.env.NODE_ENV === "development") {
  app.use(ipLoggingMiddleware);
}
```

### Step 2: Environment Variables

Add these optional environment variables to your `.env` file:

```env
# IP Geolocation API Keys (choose one)
IPSTACK_API_KEY=your_ipstack_key_here
MAXMIND_LICENSE_KEY=your_maxmind_key_here

# Mock IP for development testing
MOCK_CLIENT_IP=203.0.113.1

# Environment
NODE_ENV=production
```

### Step 3: Proxy Server Configuration

#### For Nginx:

```nginx
location / {
    proxy_pass http://your-app:3000;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
}
```

#### For Apache:

```apache
LoadModule remoteip_module modules/mod_remoteip.so
RemoteIPHeader X-Forwarded-For
RemoteIPInternalProxy 127.0.0.1
```

#### For Cloudflare:

- Enable "Restore real visitor IPs" in your Cloudflare dashboard
- The system automatically checks for `CF-Connecting-IP` header

### Step 4: Testing

You can test the IP detection by:

1. **Development Testing**: Set `MOCK_CLIENT_IP` environment variable
2. **Production Testing**: Check the `detectedIP` field in API responses
3. **Logging**: Enable IP logging middleware to see all detected headers

## API Response Changes:

The risk assessment APIs now return additional information:

```json
{
  "success": true,
  "assessment": {
    "riskScore": 45,
    "riskLevel": "MEDIUM",
    "reasons": ["Order placed through VPN connection."],
    "riskFactors": [
      {
        "category": "DEVICE",
        "factor": "VPN_USAGE",
        "impact": 25,
        "description": "Order placed through VPN from United States",
        "severity": "HIGH"
      }
    ],
    "recommendations": ["Require additional verification"],
    "confidence": 75,
    "modelVersion": "1.1.0"
  },
  "detectedIP": "203.0.113.1"
}
```

## Production Deployment Notes:

### 1. Trust Proxy Settings

- **Single Proxy**: `app.set('trust proxy', 1)`
- **Multiple Proxies**: `app.set('trust proxy', 2)` (number of proxy layers)
- **Specific IPs**: `app.set('trust proxy', ['127.0.0.1', 'proxy-ip'])`
- **Development**: `app.set('trust proxy', true)` (trust all)

### 2. Load Balancer Configuration

- **AWS ALB**: Automatically adds `X-Forwarded-For`
- **Google Cloud Load Balancer**: Configure `X-Forwarded-For`
- **Azure Load Balancer**: Enable preserve client IP

### 3. Container/Kubernetes

- **Docker**: Ensure proxy headers are passed through
- **Kubernetes Ingress**: Set `use-forwarded-headers: "true"`

## Database Changes:

The risk assessment now stores geolocation data:

```javascript
{
  geolocationHistory: [
    {
      ip: "203.0.113.1",
      country: "United States",
      city: "New York",
      region: "NY",
      isVpn: false,
      isProxy: false,
      riskScore: 10,
      firstSeen: "2025-07-10T10:00:00Z",
      lastSeen: "2025-07-10T11:00:00Z",
      orderCount: 2,
    },
  ];
}
```

## Monitoring:

Monitor these metrics:

- **Loopback IP Warnings**: Check logs for localhost detection in production
- **Geolocation API Usage**: Monitor API rate limits and costs
- **Risk Score Distribution**: Track changes in risk assessment patterns

## Next Steps:

1. **Deploy the updated code**
2. **Configure your proxy/load balancer**
3. **Set up IP geolocation service** (optional but recommended)
4. **Monitor the logs** for proper IP detection
5. **Test with real traffic** and adjust trust proxy settings if needed

The system will now properly detect real client IPs instead of showing `::1` or `::ffff:127.0.0.1` in production!
