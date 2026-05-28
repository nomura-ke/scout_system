import { AiGenerateService } from '../service/ai-generate.service';
export declare class AiGenerateController {
    private readonly aiGenerateService;
    constructor(aiGenerateService: AiGenerateService);
    generate(): {
        body: string;
    };
}
