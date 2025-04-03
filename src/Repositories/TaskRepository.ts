import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { Prisma,Task } from '@prisma/client';

@Injectable()
export default class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }

  async delete(id: number) {
    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }

  async save(
    data:
      | Prisma.XOR<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput>
      | Prisma.XOR<Prisma.TaskUpdateInput, Prisma.TaskUncheckedUpdateInput>,
  ) {
    if (!data.id) {
      return await this.prisma.task.create({
          data: data as Prisma.TaskCreateInput,
          });
    }
    // si pas de id, on fait un create
    // sinon on fait un update

    const { id, ...updateData } = data as Prisma.TaskUncheckedCreateInput;
    return await this.prisma.task.update({
        where: { id },
        data: updateData,
        });
      }

  async update(id: number, data: Prisma.TaskUpdateInput): Promise<Task> {
    return this.prisma.task.update({
       where: { id },
        data,
      });    
    }
}
