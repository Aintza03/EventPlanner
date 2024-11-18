import {Injectable, InternalServerErrorException, OnModuleInit} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Evento} from '../../../EventUpdate/src/evento/evento.entity';
import {Usuario} from '../../../EventUpdate/src/usuario/usuario.entity';
import {Atiende} from '../../../EventUpdate/src/atiende/atiende.entity';
import {Favorito} from '../../../EventUpdate/src/favorito/favorito.entity';
import { EventoUpdate, EventoUpdateSchema } from '../../../EventUpdate/src/evento-update/schemas/evento-update.schema';
import {NotifyGateway} from './gateway/notify.gateway';
@Injectable()
export class NotifyService implements OnModuleInit{
    constructor(@InjectModel(EventoUpdate.name) private eventoUpdateModel: Model<EventoUpdate>,
    private readonly notifyGateway: NotifyGateway,
    @InjectRepository(Evento) private eventoRepository: Repository<Evento>,
    @InjectRepository(Atiende) private atiendeRepository: Repository<Atiende>,){}

    onModuleInit(){
        this.updates();
    }
    //devuelve las ultimas 100 notificaciones obtenidas por el usuario
    async obtenerNotificaciones(idUsuario: number){
        try{
        const invitaciones = await this.atiendeRepository.find({ where: { usuario: { id: idUsuario } } });  
        const ids = invitaciones.map(invitacion => invitacion.evento.id);
        //las notificaciones pueden ser tanto de eventos de los que soy dueño o de eventos en los que estoy invitado
        return this.eventoUpdateModel.find({$or: [{id_usuario: idUsuario},{id_evento:{$in: ids}}]}).sort({fecha: -1}).limit(100);
        } catch (error){
            throw new InternalServerErrorException('Error al obtener las notificaciones');
        }
    }

    //manda las notificaciones a los usuarios en el momento en que ocurren
    private updates(){
        const cambio = this.eventoUpdateModel.watch();
        cambio.on('change', async (cambios) => {
            if(cambios.operationType === 'insert'){
                const evento = cambios.fullDocument;
                try{
                    if(evento.accion === 'responder'){
                        //solo avisa al dueño del evento
                        this.notifyGateway.notificar(evento.id_usuario, 'InvitacionRespondida', evento);
                    }else{
                        //avisa a todos los invitados y al dueño del evento: SIN TERMINAR
                        this.notifyGateway.notificar(evento.id_usuario,'EventoActualizado', evento);
                        const invitados = await this.atiendeRepository.find({ where: { evento: { id: evento.id_evento } } });
                        for (const invitado of invitados){
                            this.notifyGateway.notificar(invitado.usuario.id, 'EventoActualizado', evento);
                        }
                    }
           } catch(error){
                console.error("Error enviando notificaciones",error);
           }
        }
    });
    }
}