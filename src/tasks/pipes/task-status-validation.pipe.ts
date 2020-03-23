import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        TaskStatus.DONE,
        TaskStatus.IN_PROGESS,
        TaskStatus.OPEN
    ];


    transform(value: any) {
        value = value.toUpperCase();

        if (!this.isValidStatus(value)) {
            throw new BadRequestException(`${value} is an invalid status`);
        } 

        return value;
    }

    private isValidStatus(status: any) {
        const idx = this.allowedStatus.indexOf(status);
        return idx !== -1;
    }
}