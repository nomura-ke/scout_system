import { ScoutService } from '../service/scout.service';
import { CreateScoutDto } from '../type/create-scout.dto';
export declare class ScoutController {
    private readonly scoutService;
    constructor(scoutService: ScoutService);
    findAll(): Promise<import("../type/scout.entity").ScoutEntity[]>;
    create(createScoutDto: CreateScoutDto): Promise<import("../type/scout.entity").ScoutEntity>;
}
