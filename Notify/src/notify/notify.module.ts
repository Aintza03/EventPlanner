import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';
import { EventoUpdate, EventoUpdateSchema } from '../evento-update/schemas/evento-update.schema';
import { Evento } from '../evento/evento.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Atiende } from '../atiende/atiende.entity';
import { Favorito } from '../favorito/favorito.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    JwtModule.register({
      secret: 'd0a0c1fd67fa5fca2c42e19692575f7c2f1299cc7cf0f0b378e85406d369dbcb',
      signOptions: {algorithm: 'HS256'}
    }),
    MongooseModule.forFeature([{ name: EventoUpdate.name, schema: EventoUpdateSchema }]),
    TypeOrmModule.forFeature([Evento, Usuario, Atiende, Favorito]),
  ],
  controllers: [NotifyController],
  providers: [NotifyService],
})
export class NotifyModule {}