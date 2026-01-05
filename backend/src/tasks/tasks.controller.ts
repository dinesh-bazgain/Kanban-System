import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  NotFoundException,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Controller("tasks")
export class TasksController {
  constructor(private service: TasksService) {}

  @Get()
  async list() {
    return this.service.findAll();
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const t = await this.service.findOne(id);
    if (!t) throw new NotFoundException();
    return t;
  }

  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return this.service.create(dto);
  }

  @Put(":id")
  async replace(@Param("id") id: string, @Body() dto: UpdateTaskDto) {
    const t = await this.service.update(id, dto);
    if (!t) throw new NotFoundException();
    return t;
  }

  @Patch(":id")
  async patch(@Param("id") id: string, @Body() dto: UpdateTaskDto) {
    const t = await this.service.update(id, dto);
    if (!t) throw new NotFoundException();
    return t;
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.service.remove(id);
    return { ok: true };
  }
}
