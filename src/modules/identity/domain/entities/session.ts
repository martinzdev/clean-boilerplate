import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export type SessionProps = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt?: Date | null;
};

export class Session extends Entity<SessionProps> {
  get userId() {
    return this.props.userId;
  }

  set userId(userId: string) {
    this.props.userId = userId;
    this.touch();
  }

  get accessToken() {
    return this.props.accessToken;
  }

  set accessToken(accessToken: string) {
    this.props.accessToken = accessToken;
    this.touch();
  }

  get refreshToken() {
    return this.props.refreshToken;
  }

  set refreshToken(refreshToken: string) {
    this.props.refreshToken = refreshToken;
    this.touch();
  }

  get isActive() {
    return this.props.isActive;
  }

  set isActive(isActive: boolean) {
    this.props.isActive = isActive;
    this.touch();
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  set expiresAt(expiresAt: Date) {
    this.props.expiresAt = expiresAt;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  touch() {
    this.props.updatedAt = new Date();
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  static create(
    props: Optional<SessionProps, "isActive" | "createdAt">,
    id?: UniqueEntityID
  ) {
    return new Session(
      {
        ...props,
        isActive: props.isActive ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id
    );
  }
}
