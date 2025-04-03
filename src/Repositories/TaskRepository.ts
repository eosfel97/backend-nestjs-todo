import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { Prisma, Task } from '@prisma/client';

@Injectable()
export default class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      orderBy: {
        priority: 'asc',
      },
    });
  }

  async delete(id: number): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async save(
    data:
      | Prisma.XOR<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput>
      | Prisma.XOR<Prisma.TaskUpdateInput, Prisma.TaskUncheckedUpdateInput>,
  ): Promise<Task> {
    // Vérifie que la priorité est l'une des valeurs autorisées ; sinon, on la règle à "MEDIUM"
    if (data.priority && !['HIGH', 'MEDIUM', 'LOW'].includes(data.priority as string)) {
      data.priority = 'MEDIUM';
    }

    if (!data.id) {
      // Si la priorité n'est pas définie lors de la création, on lui attribue "MEDIUM"
      if (!data.priority) {
        data.priority = 'MEDIUM';
      }
      return await this.prisma.task.create({
        data: data as Prisma.TaskCreateInput,
      });
    }

    // Cas de la mise à jour : on extrait l'id et on passe le reste des données à l'update
    const { id, ...updateData } = data as Prisma.TaskUncheckedCreateInput;
    return await this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async update(id: number, data: Prisma.TaskUpdateInput): Promise<Task> {
    if (data.priority && !['HIGH', 'MEDIUM', 'LOW'].includes(data.priority as string)) {
      data.priority = 'MEDIUM';
    }
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async updatePriority(id: number, priority: string): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: { priority },
    });
  }
}
