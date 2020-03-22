import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {

    }

    @Get()
    getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
        console.log(filterDto)
        if (Object.keys(filterDto).length) {
            return this.tasksService.getTasksWithFitlers(filterDto);
        } else {
            return this.tasksService.getAllTasks();
        }

    }

    @Get("/:id") 
    getTaskByID(@Param('id') id:string) {
        return this.tasksService.getTaskByID(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete("/:id")
    deleteTask(@Param('id') id: string): void {
        this.tasksService.deleteTask(id);
    }

    @Patch("/:id/status")
    updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus) : Task {
        return this.tasksService.updateTask(id, status);
    }
}
