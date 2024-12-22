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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EventoUpdate.name, schema: EventoUpdateSchema }]),
    TypeOrmModule.forFeature([Evento, Usuario, Atiende, Favorito]),
  ],
  controllers: [NotifyController],
  providers: [NotifyService],
})
export class NotifyModule {}