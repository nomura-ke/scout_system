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
exports.ScoutController = void 0;
const common_1 = require("@nestjs/common");
const scout_service_1 = require("../service/scout.service");
const create_scout_dto_1 = require("../type/create-scout.dto");
let ScoutController = class ScoutController {
    constructor(scoutService) {
        this.scoutService = scoutService;
    }
    findAll() {
        return this.scoutService.findAll();
    }
    create(createScoutDto) {
        return this.scoutService.create(createScoutDto);
    }
};
exports.ScoutController = ScoutController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScoutController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_scout_dto_1.CreateScoutDto]),
    __metadata("design:returntype", void 0)
], ScoutController.prototype, "create", null);
exports.ScoutController = ScoutController = __decorate([
    (0, common_1.Controller)('api/scouts'),
    __metadata("design:paramtypes", [scout_service_1.ScoutService])
], ScoutController);
//# sourceMappingURL=scout.controller.js.map