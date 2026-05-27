import { ScoutRepository } from '../repository/scout.repository';
import { ScoutEntity } from '../type/scout';
export declare class ScoutService {
    private readonly scoutRepository;
    constructor(scoutRepository: ScoutRepository);
    findAll(): Promise<ScoutEntity[]>;
    create(input: ScoutEntity): Promise<ScoutEntity>;
    private generateId;
}
