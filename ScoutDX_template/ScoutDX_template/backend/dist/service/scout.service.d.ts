import { ScoutRepository } from '../repository/scout.repository';
import { CreateScoutDto } from '../type/create-scout.dto';
import { ScoutEntity } from '../type/scout.entity';
export declare class ScoutService {
    private readonly scoutRepository;
    constructor(scoutRepository: ScoutRepository);
    findAll(): Promise<ScoutEntity[]>;
    create(dto: CreateScoutDto): Promise<ScoutEntity>;
    private generateId;
}
