import { BadRequestException, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';
import TaskRepository from '../../Repositories/TaskRepository';

@Injectable()
export default class SaveTaskUseCase implements UseCase<Promise<Task>, [dto: SaveTaskDto]> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(dto: SaveTaskDto): Promise<Task> {
    try {
      // On récupère la priorité si elle est fournie dans le DTO via un cast,
      // sinon, on la laisse undefined pour que le repository la traite par défaut.
      const priority = (dto as any).priority;
      if (dto.id) {
        return await this.taskRepository.update(dto.id, { name: dto.name, priority });
      } else {
        return await this.taskRepository.save({ name: dto.name, priority });
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
