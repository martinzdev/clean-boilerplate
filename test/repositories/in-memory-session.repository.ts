import { SessionRepository } from "@/modules/identity/application/ports/repositories/session.repository";
import { Session } from "@/modules/identity/domain/entities/session";

export class InMemorySessionRepository implements SessionRepository {
  public sessions: Session[] = [];

  async save(session: Session): Promise<void> {
    const existingIndex = this.sessions.findIndex((s) => s.id === session.id);

    if (existingIndex >= 0) {
      this.sessions[existingIndex] = session;
    } else {
      this.sessions.push(session);
    }
  }

  async findById(id: string): Promise<Session | null> {
    const session = this.sessions.find(
      (session) => session.id.toString() === id
    );
    return session || null;
  }

  async findOne(filter?: Partial<Session>): Promise<Session | null> {
    if (!filter) {
      return this.sessions.length > 0 ? this.sessions[0] : null;
    }

    const session = this.sessions.find((session) => {
      return Object.entries(filter).every(([key, value]) => {
        return session[key as keyof Session]?.toString() === value?.toString();
      });
    });

    return session || null;
  }

  async findMany(filter?: Partial<Session>): Promise<Session[]> {
    if (!filter) {
      return [...this.sessions];
    }

    const filteredSessions = this.sessions.filter((session) => {
      return Object.entries(filter).every(([key, value]) => {
        return session[key as keyof Session]?.toString() === value?.toString();
      });
    });

    return filteredSessions;
  }

  async exists(filter?: Partial<Session>): Promise<boolean> {
    const session = await this.findOne(filter);
    return session !== null;
  }

  async remove(id: string): Promise<void> {
    const index = this.sessions.findIndex(
      (session) => session.id.toString() === id
    );

    if (index >= 0) {
      this.sessions.splice(index, 1);
    }
  }
}
