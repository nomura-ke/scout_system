"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiGenerateService = void 0;
const common_1 = require("@nestjs/common");
let AiGenerateService = class AiGenerateService {
    constructor() {
        this.samples = [
            `はじめまして。弊社の採用担当です。

プロフィールを拝見し、これまでのご経験に大変興味を持ちました。特にチームでの開発推進や品質改善への取り組みが、当社のカルチャーと合致していると感じています。

もしご興味がおありでしたら、まずはカジュアルにお話しできれば幸いです。ご多忙のところ恐れ入りますが、ご検討いただけますと嬉しいです。`,
            `突然のご連絡失礼いたします。〇〇株式会社でエンジニア採用を担当しております。

ご実績を拝見し、ぜひ当社のプロダクト開発チームでお力をお借りしたいと考え、ご連絡いたしました。リモートワークも可能で、技術選定への関与度も高い環境です。

ご不明点があればお気軽にお問い合わせください。面談のご都合がよろしければ、ご返信いただけますと幸いです。`,
            `プロフィールを拝見し、ご連絡させていただきました。

当社では〇〇領域のサービスを展開しており、バックエンドからフロントエンドまで幅広く携わっていただける方を探しております。ご経験の技術スタックは、現在の開発体制とも好相性です。

まずは30分ほどオンラインでご説明させていただければと思います。ご興味をお持ちいただけましたら、お気軽にご返信ください。`,
        ];
    }
    getSample() {
        const index = Math.floor(Math.random() * this.samples.length);
        return { body: this.samples[index] };
    }
};
exports.AiGenerateService = AiGenerateService;
exports.AiGenerateService = AiGenerateService = __decorate([
    (0, common_1.Injectable)()
], AiGenerateService);
//# sourceMappingURL=ai-generate.service.js.map