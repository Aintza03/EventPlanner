import { Module } from '@nestjs/common';
import { EventoUpdateController } from './evento-update.controller';
import { EventoUpdateService } from './evento-update.service';
import {MongooseModule} from '@nestjs/mongoose';
import { EventoUpdate, EventoUpdateSchema } from './schemas/evento-update.schema';
import {Evento} from '../evento/evento.entity';
import {Atiende} from '../atiende/atiende.entity';
import {EventoModule} from '../evento/evento.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JwtModule} from '@nestjs/jwt';
@Module({
  imports: [
    JwtModule.register({
      secret: 'd0a0c1fd67fa5fca2c42e19692575f7c2f1299cc7cf0f0b378e85406d369dbcb',
      signOptions: {algorithm: 'HS256'}
    }),
    MongooseModule.forFeature([{name: EventoUpdate.name, schema: EventoUpdateSchema}]),
    TypeOrmModule.forFeature([Evento, Atiende]),
  ],
  controllers: [EventoUpdateController],
  providers: [EventoUpdateService]
})
export class EventoUpdateModule {}
