import { Module } from '@nestjs/common';
import { EventoUpdateController } from './evento-update.controller';
import { EventoUpdateService } from './evento-update.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventoUpdate, EventoUpdateSchema } from './schemas/evento-update.schema';
import { Evento } from '../evento/evento.entity';
import { Atiende } from '../atiende/atiende.entity';
import { EventoModule } from '../evento/evento.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EventoUpdate.name, schema: EventoUpdateSchema }]),
    TypeOrmModule.forFeature([Evento, Atiende]),
    EventoModule,
  ],
  controllers: [EventoUpdateController],
  providers: [EventoUpdateService],
})
export class EventoUpdateModule {}