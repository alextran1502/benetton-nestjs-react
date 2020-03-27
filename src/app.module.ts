import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

@Module({
    imports: [
        // ServeStaticModule.forRoot({
        //     rootPath: join(__dirname, '..', 'client', 'public')
        // }),
        TypeOrmModule.forRoot(typeOrmConfig),
        TasksModule,
        AuthModule
    ],
    controllers: []
})
export class AppModule {}
