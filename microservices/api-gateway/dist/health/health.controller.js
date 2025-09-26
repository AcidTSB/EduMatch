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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const proxy_service_1 = require("../gateway/proxy.service");
let HealthController = class HealthController {
    constructor(proxyService) {
        this.proxyService = proxyService;
    }
    async check() {
        const services = this.proxyService.getServiceRegistry();
        const serviceHealth = {};
        for (const [serviceName, serviceUrl] of Object.entries(services)) {
            serviceHealth[serviceName] = {
                url: serviceUrl,
                healthy: await this.proxyService.checkServiceHealth(serviceName),
            };
        }
        return {
            status: 'ok',
            service: 'api-gateway',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            services: serviceHealth,
        };
    }
    getServices() {
        return {
            services: this.proxyService.getServiceRegistry(),
            timestamp: new Date().toISOString(),
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'API Gateway health check with service status'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('services'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all registered services'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getServices", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], HealthController);
//# sourceMappingURL=health.controller.js.map