import { Repository } from 'typeorm';
import { ScoutEntity } from '../type/scout';
export declare class ScoutRepository {
    private readonly repository;
    constructor(repository: Repository<ScoutEntity>);
    findAll(): Promise<ScoutEntity[]>;
    save(scout: ScoutEntity): Promise<ScoutEntity>;
}
