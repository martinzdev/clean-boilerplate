import { Repository } from "@/@shared/core/repositories/repository.interface";
import { User } from "@/modules/identity/domain/entities/user";

export abstract class UserRepository implements Repository<User> {
  abstract save(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findOne(filter?: Partial<User>): Promise<User | null>;
  abstract findMany(filter?: Partial<User>): Promise<User[]>;
  abstract exists(id: string): Promise<boolean>;
  abstract remove(id: string): Promise<void>;
}
