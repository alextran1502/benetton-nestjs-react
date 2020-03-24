import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTask(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;

        // Using query builder
        const query = this.createQueryBuilder('task'); // Refering to the task entity

        console.log(status)
        if (status) {
            query.andWhere('task.status = :status', { status })
        }

        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` })
        }

        const task = await query.getMany();
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();

        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;

        await task.save();

        return task;
    }

}