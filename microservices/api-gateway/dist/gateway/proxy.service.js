"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let ProxyService = class ProxyService {
    constructor() {
        this.serviceRegistry = new Map();
        this.serviceRegistry.set('auth-service', 'http://localhost:3002');
        this.serviceRegistry.set('user-service', 'http://localhost:3003');
        this.serviceRegistry.set('scholarship-service', 'http://localhost:3004');
        this.serviceRegistry.set('application-service', 'http://localhost:3005');
        this.serviceRegistry.set('matching-service', 'http://localhost:3006');
        this.serviceRegistry.set('notification-service', 'http://localhost:3007');
    }
    async proxyRequest(req, res, serviceName, port) {
        try {
            const serviceUrl = this.serviceRegistry.get(serviceName);
            if (!serviceUrl) {
                return res.status(503).json({
                    error: 'Service not available',
                    service: serviceName
                });
            }
            const originalUrl = req.originalUrl;
            const pathWithoutPrefix = originalUrl.replace(/^\/api\/[^\/]+/, '');
            const targetUrl = `${serviceUrl}/api${pathWithoutPrefix}`;
            console.log(`🔄 Proxying ${req.method} ${originalUrl} -> ${targetUrl}`);
            const response = await (0, axios_1.default)({
                method: req.method,
                url: targetUrl,
                data: req.body,
                headers: {
                    ...req.headers,
                    host: `localhost:${port}`,
                },
                params: req.query,
                timeout: 10000,
            });
            Object.keys(response.headers).forEach(key => {
                res.setHeader(key, response.headers[key]);
            });
            res.status(response.status).json(response.data);
        }
        catch (error) {
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
    async checkServiceHealth(serviceName) {
        try {
            const serviceUrl = this.serviceRegistry.get(serviceName);
            if (!serviceUrl)
                return false;
            const response = await axios_1.default.get(`${serviceUrl}/api/health`, { timeout: 5000 });
            return response.status === 200;
        }
        catch {
            return false;
        }
    }
    getServiceRegistry() {
        return Object.fromEntries(this.serviceRegistry);
    }
};
exports.ProxyService = ProxyService;
exports.ProxyService = ProxyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProxyService);
//# sourceMappingURL=proxy.service.js.map