import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

interface ServiceConfig {
  name: string;
  host: string;
  port: number;
  healthEndpoint?: string;
}

@Injectable()
export class ProxyService {
  private services: Map<string, ServiceConfig> = new Map([
    ['auth-service', { 
      name: 'auth-service', 
      host: 'localhost', 
      port: 3001,
      healthEndpoint: '/api/v1/health'
    }],
    ['user-service', { 
      name: 'user-service', 
      host: 'localhost', 
      port: 3002,
      healthEndpoint: '/api/v1/health'
    }],
    ['scholarship-service', { 
      name: 'scholarship-service', 
      host: 'localhost', 
      port: 3003,
      healthEndpoint: '/api/v1/health'
    }],
    ['application-service', { 
      name: 'application-service', 
      host: 'localhost', 
      port: 3004,
      healthEndpoint: '/api/v1/health'
    }],
    ['matching-service', { 
      name: 'matching-service', 
      host: 'localhost', 
      port: 5000,
      healthEndpoint: '/health'
    }],
    ['notification-service', { 
      name: 'notification-service', 
      host: 'localhost', 
      port: 3006,
      healthEndpoint: '/api/v1/health'
    }],
    ['message-service', { 
      name: 'message-service', 
      host: 'localhost', 
      port: 3007,
      healthEndpoint: '/api/v1/health'
    }],
    ['admin-service', { 
      name: 'admin-service', 
      host: 'localhost', 
      port: 3008,
      healthEndpoint: '/api/v1/health'
    }],
  ]);

  async proxy(req: Request, res: Response, serviceName: string, port: number): Promise<void> {
    const service = this.services.get(serviceName);
    
    if (!service) {
      res.status(404).json({ 
        error: 'Service not found', 
        service: serviceName 
      });
      return;
    }

    const target = `http://${service.host}:${service.port}`;
    
    const proxyMiddleware = createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (path) => {
        // Remove /api prefix from gateway and forward to service
        return path.replace('/api/v1', '/api/v1');
      },
      onError: (err, req, res) => {
        console.error(`Proxy error for ${serviceName}:`, err.message);
        res.status(503).json({ 
          error: 'Service unavailable', 
          service: serviceName,
          message: err.message 
        });
      },
      onProxyReq: (proxyReq, req) => {
        console.log(`Proxying ${req.method} ${req.url} to ${target}`);
        
        // Forward authentication headers
        if (req.headers.authorization) {
          proxyReq.setHeader('Authorization', req.headers.authorization);
        }
        
        // Add service identification
        proxyReq.setHeader('X-Gateway-Service', serviceName);
        proxyReq.setHeader('X-Gateway-Timestamp', new Date().toISOString());
      },
      onProxyRes: (proxyRes, req, res) => {
        // Add CORS headers
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
      }
    });

    return new Promise<void>((resolve, reject) => {
      proxyMiddleware(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async checkServiceHealth(serviceName: string): Promise<boolean> {
    const service = this.services.get(serviceName);
    if (!service) return false;

    try {
      const response = await fetch(
        `http://${service.host}:${service.port}${service.healthEndpoint || '/health'}`
      );
      return response.ok;
    } catch (error) {
      console.error(`Health check failed for ${serviceName}:`, error);
      return false;
    }
  }

  getServiceStatus() {
    return Array.from(this.services.entries()).map(([name, config]) => ({
      name,
      ...config,
      target: `http://${config.host}:${config.port}`
    }));
  }
}