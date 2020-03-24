import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }


    public async getTask(filterDto: GetTaskFilterDto): Promise<Task[]> {
        // return await this.taskRepository.find();
        return this.taskRepository.getTask(filterDto);
    }

    public async getTaskByID(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return found
    }


    public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    public async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        } 
    }

    public async updateTask(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskByID(id);
        task.status = status;
        return await task.save();
    }
}
