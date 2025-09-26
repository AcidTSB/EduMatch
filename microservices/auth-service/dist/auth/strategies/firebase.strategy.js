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
exports.FirebaseStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const passport_custom_1 = require("passport-custom");
const prisma_service_1 = require("../../prisma/prisma.service");
let FirebaseStrategy = class FirebaseStrategy extends (0, passport_1.PassportStrategy)(passport_custom_1.Strategy, 'firebase') {
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async validate(req) {
        const token = this.extractTokenFromHeader(req);
        if (!token) {
            throw new common_1.UnauthorizedException('No Firebase token provided');
        }
        try {
            throw new common_1.UnauthorizedException('Firebase authentication not implemented yet');
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid Firebase token');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.FirebaseStrategy = FirebaseStrategy;
exports.FirebaseStrategy = FirebaseStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FirebaseStrategy);
//# sourceMappingURL=firebase.strategy.js.map