import { Module } from '@nestjs/common';
import { EventoUpdateController } from './evento-update.controller';
import { EventoUpdateService } from './evento-update.service';
import {MongooseModule} from '@nestjs/mongoose';
import { EventoUpdate, EventoUpdateSchema } from './schemas/evento-update.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{name: EventoUpdate.name, schema: EventoUpdateSchema}]),
  ],
  controllers: [EventoUpdateController],
  providers: [EventoUpdateService]
})
export class EventoUpdateModule {}
