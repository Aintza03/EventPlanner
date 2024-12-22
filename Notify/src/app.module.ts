import { Module } from '@nestjs/common';
import { EventoUpdateModule } from './evento-update/evento-update.module';
import { UsuarioModule } from './usuario/usuario.module';
import { EventoModule } from './evento/evento.module';
import { AtiendeModule } from './atiende/atiende.module';
import { FavoritoModule } from './favorito/favorito.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifyModule } from './notify/notify.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({imports: [
  MongooseModule.forRoot('mongodb://host.docker.internal:27017/eventUpdateDB'),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'host.docker.internal',
    port: 3306,
    username: 'usuarioEvento',
    password: 'contrasena',
    database: 'Eventos',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
  }),
  NotifyModule,    
  EventoUpdateModule,
  EventoModule,
  UsuarioModule,
  AtiendeModule,
  FavoritoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
