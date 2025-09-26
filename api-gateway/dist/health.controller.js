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
const proxy_service_1 = require("./services/proxy.service");
let HealthController = class HealthController {
    constructor(proxyService) {
        this.proxyService = proxyService;
    }
    async getHealth() {
        return {
            status: 'UP',
            timestamp: new Date().toISOString(),
            gateway: 'EduMatch API Gateway',
            version: '1.0.0'
        };
    }
    async getServicesHealth() {
        const services = this.proxyService.getServiceStatus();
        const healthChecks = await Promise.all(services.map(async (service) => ({
            name: service.name,
            target: service.target,
            healthy: await this.proxyService.checkServiceHealth(service.name),
            timestamp: new Date().toISOString()
        })));
        const overallHealthy = healthChecks.every(check => check.healthy);
        return {
            status: overallHealthy ? 'UP' : 'DEGRADED',
            timestamp: new Date().toISOString(),
            services: healthChecks,
            summary: {
                total: healthChecks.length,
                healthy: healthChecks.filter(s => s.healthy).length,
                unhealthy: healthChecks.filter(s => !s.healthy).length
            }
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Gateway health check' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'Check all microservices health' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getServicesHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], HealthController);
//# sourceMappingURL=health.controller.js.map