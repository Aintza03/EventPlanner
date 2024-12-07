import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';
import { NotifyGateway } from './gateway/notify.gateway';
import { EventoUpdate, EventoUpdateSchema } from '../../../EventUpdate/src/evento-update/schemas/evento-update.schema';
import { Evento } from '../../../EventUpdate/src/evento/evento.entity'
import { Usuario } from '../../../EventUpdate/src/usuario/usuario.entity'
import { Atiende } from '../../../EventUpdate/src/atiende/atiende.entity'
import { Favorito } from '../../../EventUpdate/src/favorito/favorito.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EventoUpdate.name, schema: EventoUpdateSchema }]),
    TypeOrmModule.forFeature([Evento, Usuario, Atiende, Favorito]),
  ],
  controllers: [NotifyController],
  providers: [NotifyService, NotifyGateway],
})
export class NotifyModule {}