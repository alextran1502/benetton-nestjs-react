import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) {

    }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTaskFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieveing all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.tasksService.getTask(filterDto, user);
    }

    @Get("/:id")
    getTaskByID(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskByID(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" Creates a task. Data: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete("/:id")
    deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }

    @Patch("/:id/status")
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User): Promise<Task> {
        return this.tasksService.updateTask(id, status, user);
    }
}
