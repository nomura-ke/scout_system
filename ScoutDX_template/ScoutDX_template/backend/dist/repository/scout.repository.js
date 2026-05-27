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
exports.ScoutRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const scout_entity_1 = require("../type/scout.entity");
let ScoutRepository = class ScoutRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findAll() {
        return this.repository.query('SELECT * FROM scouts ORDER BY created_at DESC');
    }
    async save(scout) {
        await this.repository.query(`INSERT INTO scouts (id, creator, title, body, status) VALUES ($1, $2, $3, $4, $5)`, [scout.id, scout.creator, scout.title, scout.body, scout.status]);
        const rows = await this.repository.query(`SELECT * FROM scouts WHERE id = $1`, [scout.id]);
        if (rows.length === 0)
            throw new Error('Scout not found after insert');
        return rows[0];
    }
};
exports.ScoutRepository = ScoutRepository;
exports.ScoutRepository = ScoutRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(scout_entity_1.ScoutEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ScoutRepository);
//# sourceMappingURL=scout.repository.js.map