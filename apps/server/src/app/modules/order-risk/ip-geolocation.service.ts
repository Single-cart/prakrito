import { GeolocationData } from "./order-risk.interface";

interface IPGeolocationResponse {
  country?: string;
  city?: string;
  region?: string;
  isVpn?: boolean;
  isProxy?: boolean;
  riskScore?: number;
}

class IPGeolocationService {
  private readonly cache = new Map<string, GeolocationData>();
  private readonly cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get geolocation data for an IP address
   * In production, you would integrate with services like:
   * - MaxMind GeoIP2
   * - IPStack
   * - IP2Location
   * - Cloudflare IP Geolocation
   */
  async getGeolocationData(ip: string): Promise<GeolocationData> {
    // Check cache first
    const cached = this.cache.get(ip);
    if (cached && Date.now() - cached.lastSeen.getTime() < this.cacheTimeout) {
      return {
        ...cached,
        lastSeen: new Date(),
        orderCount: cached.orderCount + 1,
      };
    }

    // Handle local/development IPs
    if (this.isLocalIP(ip)) {
      return this.createLocalGeolocationData(ip);
    }

    // In production, replace this with actual geolocation API calls
    const geoData = await this.fetchGeolocationFromAPI(ip);

    const geolocationData: GeolocationData = {
      ip,
      country: geoData.country || "Unknown",
      city: geoData.city || "Unknown",
      region: geoData.region || "Unknown",
      isVpn: geoData.isVpn || false,
      isProxy: geoData.isProxy || false,
      riskScore: this.calculateIPRiskScore(geoData),
      firstSeen: cached?.firstSeen || new Date(),
      lastSeen: new Date(),
      orderCount: (cached?.orderCount || 0) + 1,
    };

    // Update cache
    this.cache.set(ip, geolocationData);

    return geolocationData;
  }

  private isLocalIP(ip: string): boolean {
    const localPatterns = [
      /^127\./, // 127.x.x.x
      /^192\.168\./, // 192.168.x.x
      /^10\./, // 10.x.x.x
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.x.x to 172.31.x.x
      /^::1$/, // IPv6 localhost
      /^fe80:/, // IPv6 link-local
    ];

    return localPatterns.some((pattern) => pattern.test(ip));
  }

  private createLocalGeolocationData(ip: string): GeolocationData {
    return {
      ip,
      country: "Local",
      city: "Development",
      region: "Local",
      isVpn: false,
      isProxy: false,
      riskScore: 0,
      firstSeen: new Date(),
      lastSeen: new Date(),
      orderCount: 1,
    };
  }

  private async fetchGeolocationFromAPI(
    ip: string
  ): Promise<IPGeolocationResponse> {
    try {
      // Example implementation using a free IP geolocation service
      // In production, use a paid service for better accuracy and rate limits

      // For demonstration, using a mock response
      // Replace this with actual API call to your chosen provider

      if (process.env.IPSTACK_API_KEY) {
        return await this.fetchFromIPStack(ip);
      } else if (process.env.MAXMIND_LICENSE_KEY) {
        return await this.fetchFromMaxMind(ip);
      } else {
        // Fallback to a free service (with limitations)
        return await this.fetchFromFreeService(ip);
      }
    } catch (error) {
      console.error("Error fetching geolocation data:", error);
      return this.getDefaultGeolocationData();
    }
  }

  private async fetchFromIPStack(ip: string): Promise<IPGeolocationResponse> {
    // Example IPStack integration
    const response = await fetch(
      `http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_API_KEY}&fields=country_name,city,region_name`
    );
    const data = (await response.json()) as any;

    return {
      country: data.country_name,
      city: data.city,
      region: data.region_name,
      isVpn: false, // IPStack doesn't provide VPN detection in free tier
      isProxy: false,
    };
  }

  private async fetchFromMaxMind(ip: string): Promise<IPGeolocationResponse> {
    // Example MaxMind integration
    // You would use the MaxMind Node.js library here
    // This is a placeholder implementation
    return {
      country: "Unknown",
      city: "Unknown",
      region: "Unknown",
      isVpn: false,
      isProxy: false,
    };
  }

  private async fetchFromFreeService(
    ip: string
  ): Promise<IPGeolocationResponse> {
    try {
      // Using ipapi.co as a free service example
      // Note: Free services have rate limits and less accuracy
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = (await response.json()) as any;

      return {
        country: data.country_name,
        city: data.city,
        region: data.region,
        isVpn: data.threat?.is_anonymous || false,
        isProxy: data.threat?.is_proxy || false,
      };
    } catch (error) {
      console.error("Error with free geolocation service:", error);
      return this.getDefaultGeolocationData();
    }
  }

  private getDefaultGeolocationData(): IPGeolocationResponse {
    return {
      country: "Unknown",
      city: "Unknown",
      region: "Unknown",
      isVpn: false,
      isProxy: false,
    };
  }

  private calculateIPRiskScore(geoData: IPGeolocationResponse): number {
    let riskScore = 0;

    // Increase risk for VPN/Proxy usage
    if (geoData.isVpn) riskScore += 30;
    if (geoData.isProxy) riskScore += 25;

    // Add risk based on country (you can customize this based on your business needs)
    const higherRiskCountries = ["Unknown"]; // Add countries as needed
    if (higherRiskCountries.includes(geoData.country || "")) {
      riskScore += 20;
    }

    return Math.min(riskScore, 100);
  }

  /**
   * Clear old cache entries to prevent memory leaks
   */
  clearOldCache(): void {
    const now = Date.now();
    for (const [ip, data] of this.cache.entries()) {
      if (now - data.lastSeen.getTime() > this.cacheTimeout) {
        this.cache.delete(ip);
      }
    }
  }
}

export const ipGeolocationService = new IPGeolocationService();

// Clear cache every hour
setInterval(
  () => {
    ipGeolocationService.clearOldCache();
  },
  60 * 60 * 1000
);
