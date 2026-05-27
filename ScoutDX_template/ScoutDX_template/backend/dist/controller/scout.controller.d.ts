import { ScoutService } from '../service/scout.service';
import { ScoutEntity } from '../type/scout';
export declare class ScoutController {
    private readonly scoutService;
    constructor(scoutService: ScoutService);
    findAll(): Promise<ScoutEntity[]>;
    create(body: ScoutEntity): Promise<ScoutEntity>;
}
