import { Repository } from "@/core/repositories/repository.interface";
import { Session } from "@/modules/identity/domain/entities/session";

export abstract class SessionRepository implements Repository<Session> {
  abstract save(session: Session): Promise<void>;
  abstract findById(id: string): Promise<Session | null>;
  abstract findOne(filter?: Partial<Session>): Promise<Session | null>;
  abstract findMany(filter?: Partial<Session>): Promise<Session[]>;
  abstract exists(filter?: Partial<Session>): Promise<boolean>;
  abstract remove(id: string): Promise<void>;
}
