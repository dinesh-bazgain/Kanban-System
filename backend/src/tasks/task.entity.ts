import {
  Entity,
  PrimaryGeneratedColumn,
  Column as ORMColumn,
  CreateDateColumn,
} from "typeorm";

@Entity({ name: "tasks" })
export class TaskEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ORMColumn({ type: "varchar", length: 255 })
  title!: string;

  @ORMColumn({ type: "varchar", length: 100 })
  columnId!: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;
}
