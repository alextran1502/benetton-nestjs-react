import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }


    public async getTask(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        // return await this.taskRepository.find();
        return this.taskRepository.getTask(filterDto, user);
    }

    public async getTaskByID(id: number, user: User): Promise<Task> {
        
        const found = await this.taskRepository.findOne({ where: {id, userId: user.id}});

        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return found
    }


    public async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    public async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id});

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        } 
    }

    public async updateTask(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskByID(id, user);
        task.status = status;
        return await task.save();
    }
}
