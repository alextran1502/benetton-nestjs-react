import { TaskStatus } from "../task-status.enum";
import { IsOptional, IsIn, IsNotEmpty } from "class-validator";

export class GetTaskFilterDto {
    @IsOptional()
    @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGESS, TaskStatus.OPEN])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}