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
exports.ScoutService = void 0;
const common_1 = require("@nestjs/common");
const scout_repository_1 = require("../repository/scout.repository");
const scout_1 = require("../type/scout");
let ScoutService = class ScoutService {
    constructor(scoutRepository) {
        this.scoutRepository = scoutRepository;
    }
    findAll() {
        return this.scoutRepository.findAll();
    }
    async create(input) {
        if (!input.creator?.trim() || !input.title?.trim() || !input.body?.trim()) {
            throw new common_1.BadRequestException('作成者・タイトル・本文は必須です');
        }
        const scout = new scout_1.ScoutEntity();
        scout.id = this.generateId();
        scout.creator = input.creator.trim();
        scout.title = input.title.trim();
        scout.body = input.body.trim();
        scout.status = input.status?.trim() || 'DRAFT';
        return this.scoutRepository.save(scout);
    }
    generateId() {
        return Math.random().toString(36).substring(2, 9).toUpperCase();
    }
};
exports.ScoutService = ScoutService;
exports.ScoutService = ScoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scout_repository_1.ScoutRepository])
], ScoutService);
//# sourceMappingURL=scout.service.js.map