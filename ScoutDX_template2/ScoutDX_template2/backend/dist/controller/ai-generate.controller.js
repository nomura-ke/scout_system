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
exports.AiGenerateController = void 0;
const common_1 = require("@nestjs/common");
const ai_generate_service_1 = require("../service/ai-generate.service");
let AiGenerateController = class AiGenerateController {
    constructor(aiGenerateService) {
        this.aiGenerateService = aiGenerateService;
    }
    generate() {
        return this.aiGenerateService.getSample();
    }
};
exports.AiGenerateController = AiGenerateController;
__decorate([
    (0, common_1.Get)('generate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiGenerateController.prototype, "generate", null);
exports.AiGenerateController = AiGenerateController = __decorate([
    (0, common_1.Controller)('api/ai'),
    __metadata("design:paramtypes", [ai_generate_service_1.AiGenerateService])
], AiGenerateController);
//# sourceMappingURL=ai-generate.controller.js.map