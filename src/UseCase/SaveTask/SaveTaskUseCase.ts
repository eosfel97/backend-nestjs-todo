import { BadRequestException,Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';
import TaskRepository from '../../Repositories/TaskRepository';


@Injectable()
export default class SaveTaskUseCase implements UseCase<Promise<Task>, [dto: SaveTaskDto]> {
  constructor( private readonly taskRepository: TaskRepository) {}

  async handle(dto: SaveTaskDto): Promise<Task> {
  try{
     // Si l'ID est présent dans le DTO, il s'agit d'une mise à jour
      if (dto.id){
          return await this.taskRepository.update(dto.id,{name: dto.name});
          } else {
              return await this.taskRepository.save({name: dto.name });
              }
      } catch (error){
          throw new BadRequestException(error.message);
          }

  }
}
