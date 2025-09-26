import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class ProxyService {
  private readonly serviceRegistry = new Map<string, string>();

  constructor() {
    // Register microservices
    this.serviceRegistry.set('auth-service', 'http://localhost:3002');
    this.serviceRegistry.set('user-service', 'http://localhost:3003');
    this.serviceRegistry.set('scholarship-service', 'http://localhost:3004');
    this.serviceRegistry.set('application-service', 'http://localhost:3005');
    this.serviceRegistry.set('matching-service', 'http://localhost:3006');
    this.serviceRegistry.set('notification-service', 'http://localhost:3007');
  }

  async proxyRequest(req: Request, res: Response, serviceName: string, port: number) {
    try {
      const serviceUrl = this.serviceRegistry.get(serviceName);
      
      if (!serviceUrl) {
        return res.status(503).json({ 
          error: 'Service not available',
          service: serviceName 
        });
      }

      // Remove the first path segment (service name) from the URL
      const originalUrl = req.originalUrl;
      const pathWithoutPrefix = originalUrl.replace(/^\/api\/[^\/]+/, '');
      const targetUrl = `${serviceUrl}/api${pathWithoutPrefix}`;

      console.log(`🔄 Proxying ${req.method} ${originalUrl} -> ${targetUrl}`);

      // Forward the request
      const response = await axios({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        headers: {
          ...req.headers,
          host: `localhost:${port}`,
        },
        params: req.query,
        timeout: 10000,
      });

      // Forward response headers and data
      Object.keys(response.headers).forEach(key => {
        res.setHeader(key, response.headers[key]);
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(`❌ Proxy error for ${serviceName}:`, error.message);
      
      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
          error: 'Service unavailable',
          service: serviceName,
          message: `Cannot connect to ${serviceName} on port ${port}`,
        });
      }

      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }

      res.status(500).json({
        error: 'Internal proxy error',
        service: serviceName,
        message: error.message,
      });
    }
  }

  async checkServiceHealth(serviceName: string): Promise<boolean> {
    try {
      const serviceUrl = this.serviceRegistry.get(serviceName);
      if (!serviceUrl) return false;

      const response = await axios.get(`${serviceUrl}/api/health`, { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  getServiceRegistry() {
    return Object.fromEntries(this.serviceRegistry);
  }
}