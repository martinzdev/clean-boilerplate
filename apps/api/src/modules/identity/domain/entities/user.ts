import { Entity } from "@/@shared/core/entities/entity";
import { UniqueEntityID } from "@/@shared/core/entities/unique-entity-id";

export type UserProps = {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date | null;
};

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id);

    return user;
  }
}
