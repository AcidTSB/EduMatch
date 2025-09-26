"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyService = void 0;
const common_1 = require("@nestjs/common");
const http_proxy_middleware_1 = require("http-proxy-middleware");
let ProxyService = class ProxyService {
    constructor() {
        this.services = new Map([
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
    }
    async proxy(req, res, serviceName, port) {
        const service = this.services.get(serviceName);
        if (!service) {
            res.status(404).json({
                error: 'Service not found',
                service: serviceName
            });
            return;
        }
        const target = `http://${service.host}:${service.port}`;
        const proxyMiddleware = (0, http_proxy_middleware_1.createProxyMiddleware)({
            target,
            changeOrigin: true,
            pathRewrite: (path) => {
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
                if (req.headers.authorization) {
                    proxyReq.setHeader('Authorization', req.headers.authorization);
                }
                proxyReq.setHeader('X-Gateway-Service', serviceName);
                proxyReq.setHeader('X-Gateway-Timestamp', new Date().toISOString());
            },
            onProxyRes: (proxyRes, req, res) => {
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS';
                proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
            }
        });
        return new Promise((resolve, reject) => {
            proxyMiddleware(req, res, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async checkServiceHealth(serviceName) {
        const service = this.services.get(serviceName);
        if (!service)
            return false;
        try {
            const response = await fetch(`http://${service.host}:${service.port}${service.healthEndpoint || '/health'}`);
            return response.ok;
        }
        catch (error) {
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
};
exports.ProxyService = ProxyService;
exports.ProxyService = ProxyService = __decorate([
    (0, common_1.Injectable)()
], ProxyService);
//# sourceMappingURL=proxy.service.js.map