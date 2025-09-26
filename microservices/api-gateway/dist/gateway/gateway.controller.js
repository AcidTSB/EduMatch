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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const proxy_service_1 = require("./proxy.service");
let GatewayController = class GatewayController {
    constructor(proxyService) {
        this.proxyService = proxyService;
    }
    async proxyToAuth(req, res) {
        return this.proxyService.proxyRequest(req, res, 'auth-service', 3002);
    }
    async proxyToUsers(req, res) {
        return this.proxyService.proxyRequest(req, res, 'user-service', 3003);
    }
    async proxyToProfiles(req, res) {
        return this.proxyService.proxyRequest(req, res, 'user-service', 3003);
    }
    async proxyToScholarships(req, res) {
        return this.proxyService.proxyRequest(req, res, 'scholarship-service', 3004);
    }
    async proxyToApplications(req, res) {
        return this.proxyService.proxyRequest(req, res, 'application-service', 3005);
    }
    async proxyToMatching(req, res) {
        return this.proxyService.proxyRequest(req, res, 'matching-service', 3006);
    }
    async proxyToNotifications(req, res) {
        return this.proxyService.proxyRequest(req, res, 'notification-service', 3007);
    }
    async proxyToMessages(req, res) {
        return this.proxyService.proxyRequest(req, res, 'notification-service', 3007);
    }
};
exports.GatewayController = GatewayController;
__decorate([
    (0, common_1.All)('auth/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Auth Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyToAuth", null);
__decorate([
    (0, common_1.All)('users/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to User Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyToUsers", null);
__decorate([
    (0, common_1.All)('profiles/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to User Service for Profiles' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyToProfiles", null);
__decorate([
    (0, common_1.All)('scholarships/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Scholarship Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyToScholarships", null);
__decorate([
    (0, common_1.All)('applications/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Application Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyToApplications", null);
__decorate([
    (0, common_1.All)('matching/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Matching Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyToMatching", null);
__decorate([
    (0, common_1.All)('notifications/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Notification Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyToNotifications", null);
__decorate([
    (0, common_1.All)('messages/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Notification Service for Messages' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyToMessages", null);
exports.GatewayController = GatewayController = __decorate([
    (0, swagger_1.ApiTags)('gateway'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], GatewayController);
//# sourceMappingURL=gateway.controller.js.map