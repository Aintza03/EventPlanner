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
import { JwtModule } from '@nestjs/jwt';

@Module({imports: [
  JwtModule.register({
  secret: 'd0a0c1fd67fa5fca2c42e19692575f7c2f1299cc7cf0f0b378e85406d369dbcb',
  signOptions: {algorithm: 'HS256'}
  }),
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
