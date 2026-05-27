"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoutModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ai_generate_controller_1 = require("./controller/ai-generate.controller");
const scout_controller_1 = require("./controller/scout.controller");
const scout_repository_1 = require("./repository/scout.repository");
const ai_generate_service_1 = require("./service/ai-generate.service");
const scout_service_1 = require("./service/scout.service");
const scout_1 = require("./type/scout");
let ScoutModule = class ScoutModule {
};
exports.ScoutModule = ScoutModule;
exports.ScoutModule = ScoutModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([scout_1.ScoutEntity])],
        controllers: [scout_controller_1.ScoutController, ai_generate_controller_1.AiGenerateController],
        providers: [scout_service_1.ScoutService, scout_repository_1.ScoutRepository, ai_generate_service_1.AiGenerateService],
    })
], ScoutModule);
//# sourceMappingURL=scout.module.js.map