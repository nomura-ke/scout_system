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
exports.ScoutEntity = void 0;
const typeorm_1 = require("typeorm");
let ScoutEntity = class ScoutEntity {
};
exports.ScoutEntity = ScoutEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'id' }),
    __metadata("design:type", String)
], ScoutEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], ScoutEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'creator', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ScoutEntity.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ScoutEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'body', type: 'text' }),
    __metadata("design:type", String)
], ScoutEntity.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 20, default: 'DRAFT' }),
    __metadata("design:type", String)
], ScoutEntity.prototype, "status", void 0);
exports.ScoutEntity = ScoutEntity = __decorate([
    (0, typeorm_1.Entity)('scouts')
], ScoutEntity);
//# sourceMappingURL=scout.entity.js.map