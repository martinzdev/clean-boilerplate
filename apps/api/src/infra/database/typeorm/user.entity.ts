import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
