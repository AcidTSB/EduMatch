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
const proxy_service_1 = require("./services/proxy.service");
const swagger_1 = require("@nestjs/swagger");
let GatewayController = class GatewayController {
    constructor(proxyService) {
        this.proxyService = proxyService;
    }
    async proxyAuth(req, res) {
        return this.proxyService.proxy(req, res, 'auth-service', 3001);
    }
    async proxyUsers(req, res) {
        return this.proxyService.proxy(req, res, 'user-service', 3002);
    }
    async proxyProfiles(req, res) {
        return this.proxyService.proxy(req, res, 'profile-service', 3002);
    }
    async proxyScholarships(req, res) {
        return this.proxyService.proxy(req, res, 'scholarship-service', 3003);
    }
    async proxyApplications(req, res) {
        return this.proxyService.proxy(req, res, 'application-service', 3004);
    }
    async proxyMatching(req, res) {
        return this.proxyService.proxy(req, res, 'matching-service', 5000);
    }
    async proxyNotifications(req, res) {
        return this.proxyService.proxy(req, res, 'notification-service', 3006);
    }
    async proxyMessages(req, res) {
        return this.proxyService.proxy(req, res, 'message-service', 3007);
    }
    async proxyAdmin(req, res) {
        return this.proxyService.proxy(req, res, 'admin-service', 3008);
    }
};
exports.GatewayController = GatewayController;
__decorate([
    (0, common_1.All)('/v1/auth/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Auth Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyAuth", null);
__decorate([
    (0, common_1.All)('/v1/users/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to User Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyUsers", null);
__decorate([
    (0, common_1.All)('/v1/profiles/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Profile Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyProfiles", null);
__decorate([
    (0, common_1.All)('/v1/scholarships/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Scholarship Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyScholarships", null);
__decorate([
    (0, common_1.All)('/v1/applications/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Application Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyApplications", null);
__decorate([
    (0, common_1.All)('/v1/matching/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to AI Matching Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyMatching", null);
__decorate([
    (0, common_1.All)('/v1/notifications/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Notification Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyNotifications", null);
__decorate([
    (0, common_1.All)('/v1/messages/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Message Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyMessages", null);
__decorate([
    (0, common_1.All)('/v1/admin/*'),
    (0, swagger_1.ApiOperation)({ summary: 'Proxy to Admin Service' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyAdmin", null);
exports.GatewayController = GatewayController = __decorate([
    (0, swagger_1.ApiTags)('Gateway'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], GatewayController);
//# sourceMappingURL=gateway.controller.js.map