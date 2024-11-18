import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {NotifyController} from 'src/notify/notify.controller';
import {NotifyService} from 'src/notify/notify.service';
import {NotifyGateway} from 'src/notify/gateway/notify.gateway';
import { EventoUpdate, EventoUpdateSchema } from '../../../EventUpdate/src/evento-update/schemas/evento-update.schema';
import {Evento} from '../../../EventUpdate/src/evento/evento.entity';
import {Usuario} from '../../../EventUpdate/src/usuario/usuario.entity';
import {Atiende} from '../../../EventUpdate/src/atiende/atiende.entity';
import {Favorito} from '../../../EventUpdate/src/favorito/favorito.entity';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
    imports: [
        MongooseModule.forFeature([{name: EventoUpdate.name, schema: EventoUpdateSchema}]),
        TypeOrmModule.forFeature([Evento, Usuario, Atiende, Favorito]),
    ],
    controllers: [NotifyController],
    providers: [NotifyService, NotifyGateway],
})

export class NotifyModule{}