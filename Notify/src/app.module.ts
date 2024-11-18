import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifyModule } from './notify/notify.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({imports: [
  MongooseModule.forRoot('mongodb://localhost:27017/your-database-name'),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'usuarioEvento',
    password: 'contrasena',
    database: 'Eventos',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
  NotifyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
