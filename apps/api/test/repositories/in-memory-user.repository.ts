import { UserRepository } from "@/modules/identity/application/ports/repositories/user.repository";
import { User } from "@/modules/identity/domain/entities/user";

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = [];

  async save(user: User): Promise<void> {
    const existingUserIndex = this.users.findIndex((u) => u.id === user.id);

    if (existingUserIndex >= 0) {
      this.users[existingUserIndex] = user;
    } else {
      this.users.push(user);
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id.toString() === id);
    return user ?? null;
  }

  async findOne(filter?: Partial<User>): Promise<User | null> {
    if (!filter) {
      return this.users.length > 0 ? this.users[0] : null;
    }

    const user = this.users.find((user) => {
      return Object.entries(filter).every(([key, value]) => {
        return user[key as keyof User] === value;
      });
    });

    return user ?? null;
  }

  async findMany(filter?: Partial<User>): Promise<User[]> {
    if (!filter) {
      return [...this.users];
    }

    const filteredUsers = this.users.filter((user) => {
      return Object.entries(filter).every(([key, value]) => {
        return user[key as keyof User] === value;
      });
    });

    return filteredUsers;
  }

  async exists(id: string): Promise<boolean> {
    return this.users.some((user) => user.id.toString() === id);
  }

  async remove(id: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id.toString() === id);

    if (userIndex >= 0) {
      this.users.splice(userIndex, 1);
    }
  }
}
