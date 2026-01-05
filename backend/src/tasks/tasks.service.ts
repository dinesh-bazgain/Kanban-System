import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskEntity } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity) private repo: Repository<TaskEntity>
  ) {}

  async findAll(): Promise<TaskEntity[]> {
    return this.repo.find({ order: { createdAt: "ASC" } });
  }

  async findOne(id: string): Promise<TaskEntity | null> {
    return this.repo.findOneBy({ id });
  }

  async create(dto: CreateTaskDto): Promise<TaskEntity> {
    const t = this.repo.create({ title: dto.title, columnId: dto.columnId });
    return this.repo.save(t);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskEntity | null> {
    const t = await this.findOne(id);
    if (!t) return null;
    if (dto.title !== undefined) t.title = dto.title;
    if (dto.columnId !== undefined) t.columnId = dto.columnId;
    return this.repo.save(t);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
