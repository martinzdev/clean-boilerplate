import { SessionRepository } from "@/modules/identity/application/ports/repositories/session.repository";
import { Session } from "@/modules/identity/domain/entities/session";
import { SessionEntity } from "@/modules/identity/infra/persistence/typeorm/entities/session.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TypeOrmSessionMapper } from "../mappers/typeorm-session.mapper";

@Injectable()
export class TypeOrmSessionRepository implements SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repository: Repository<SessionEntity>
  ) {}

  async save(session: Session): Promise<void> {
    const persistenceSession = TypeOrmSessionMapper.toPersistence(session);
    await this.repository.save(persistenceSession);
  }
  async findById(id: string): Promise<Session | null> {
    const sessionEntity = await this.repository.findOne({ where: { id } });
    if (!sessionEntity) return null;
    return TypeOrmSessionMapper.toDomain(sessionEntity);
  }
  async findOne(filter?: Partial<Session>): Promise<Session | null> {
    const persistenceFilter = TypeOrmSessionMapper.toFilter(filter);
    const sessionEntity = await this.repository.findOne({
      where: persistenceFilter,
    });

    if (!sessionEntity) return null;
    return TypeOrmSessionMapper.toDomain(sessionEntity);
  }
  async findMany(filter?: Partial<Session>): Promise<Session[]> {
    const persistenceFilter = TypeOrmSessionMapper.toFilter(filter);
    const sessionEntities = await this.repository.find({
      where: persistenceFilter,
    });

    return sessionEntities.map(TypeOrmSessionMapper.toDomain);
  }
  async exists(filter?: Partial<Session>): Promise<boolean> {
    const persistenceFilter = TypeOrmSessionMapper.toFilter(filter);
    const count = await this.repository.count({ where: persistenceFilter });
    return count > 0;
  }
  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
