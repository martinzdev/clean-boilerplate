import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "sessions" })
export class SessionEntity {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column({ type: "varchar" })
  accessToken: string;

  @Column({ type: "varchar" })
  refreshToken: string;

  @Column({ type: "boolean" })
  isActive: boolean;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updatedAt?: Date | null;
}
