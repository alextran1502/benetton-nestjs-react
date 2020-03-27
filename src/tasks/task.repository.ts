import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { User } from "../auth/user.entity";


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTask(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;

        // Using query builder
        const query = this.createQueryBuilder('task'); // Refering to the task entity

        query.where('task.userId = :userId', { userId: user.id });
        
        if (status) {
            query.andWhere('task.status = :status', { status })
        }

        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` })
        }

        const task = await query.getMany();
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();

        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        await task.save();
        delete task.user;

        return task;
    }

}