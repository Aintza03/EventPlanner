import { HttpException, Inject, Injectable } from '@nestjs/common';
import { EventoUpdate } from './schemas/evento-update.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
//import { Evento } from 'src/evento/schemas/evento.schema';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import HTTP from 'http-status-codes';
import { Evento } from 'src/evento/evento.entity';
import {Atiende} from 'src/atiende/atiende.entity';
@Injectable()
export class EventoUpdateService {
    constructor(@InjectModel(EventoUpdate.name) private eventoUpdateModel: Model<EventoUpdate>,
    @InjectRepository(Evento) private eventoRepository: Repository<Evento>,
    @InjectRepository(Atiende) private atiendeRepository: Repository<Atiende>    
) {}

    private async crearUpdatesCambio(id_evento: number, id_usuario: number, accion: string, cambio: string, campo: string, descripcion: string, fecha:string): Promise<EventoUpdate> {
        const eventoUpdate = new EventoUpdate();
        eventoUpdate.id_evento = id_evento;
        eventoUpdate.id_usuario = id_usuario;
        eventoUpdate.accion = accion;
        eventoUpdate.cambio = cambio;
        eventoUpdate.campo = campo;
        eventoUpdate.descripcion = descripcion;
        eventoUpdate.fecha = fecha;
        const newUpdate = new this.eventoUpdateModel(eventoUpdate);
        return newUpdate.save();
    }
    private async crearUpdatesRespuesta(id_evento: number, id_usuario: number, accion: string, respuesta: string, descripcion: string, fecha:string): Promise<EventoUpdate> {
        const eventoUpdate = new EventoUpdate();
        eventoUpdate.id_evento = id_evento;
        eventoUpdate.id_usuario = id_usuario;
        eventoUpdate.accion = accion;
        eventoUpdate.respuesta = respuesta;
        eventoUpdate.descripcion = descripcion;
        eventoUpdate.fecha = fecha;
        const newUpdate = new this.eventoUpdateModel(eventoUpdate);
        return newUpdate.save();
    }

    //funcion que actualiza un campo concreto del evento y luego llama a crearUpdates
    async updateEvento(id_evento: number, id_usuario: number, accion: string, cambio: string, campo: string): Promise<EventoUpdate> {
        const evento = await this.eventoRepository.findOne({ where: { id: id_evento } });
        //siempre encuentra evento
        if(accion == "AnyadirInvitados"){
            const atiende = this.atiendeRepository.create({ evento: { id: id_evento }, usuario: { id: parseInt(cambio) } });
            await this.atiendeRepository.save(atiende);
        }else if(accion == "eliminarInvitados"){
            const atiende = await this.atiendeRepository.findOne({ where: { evento: { id: id_evento }, usuario: { id: parseInt(cambio) } } });
            await this.atiendeRepository.remove(atiende);
        }else{
            evento[campo] = cambio;
            await this.eventoRepository.save(evento);
        }
        return this.crearUpdatesCambio(id_evento, id_usuario, accion, cambio, campo,"Se ha cambiado el " + campo + " del evento " + id_evento + " al " + cambio + ".", new Date().toISOString());
    }
    //funcion que guarda los cambios cuando un invitado acepta o rechaza
    async respuestaInvitacion(id_evento: number, id_usuario:number, respuesta: string): Promise<EventoUpdate> {
        const atiende = await this.atiendeRepository.findOne({ where: { evento: { id: id_evento }, usuario: { id: id_usuario } } });
        if(respuesta == "aceptar"){
            return this.crearUpdatesRespuesta(id_evento, id_usuario, "responder", respuesta,"El usuario "+ id_usuario + " ha aceptado la invitacion al evento " + id_evento + ".", new Date().toISOString());
        }else if(respuesta == "rechazar"){
            await this.atiendeRepository.remove(atiende);
            return this.crearUpdatesRespuesta(id_evento, id_usuario,"responder", respuesta, "El usuario " + id_usuario+ " ha rechazado la invitacion al evento " + id_evento + ".", new Date().toISOString());
        }else{
            //throw error
            throw new HttpException("Respuesta no valida", HTTP.BAD_REQUEST);
        }
    }
    //Deshace los cambios realizados en un evento
    async deshacerCambios(id_evento: number, id_usuario:number): Promise<EventoUpdate> {
        const ultimaActualizacion = await this.eventoUpdateModel.findOne({ id_evento, campo: { $exists: true, $ne: null}, cambio: { $exists: true, $ne: null }}).sort({ fecha: -1 }).exec();
        if(!ultimaActualizacion){
            throw new HttpException("No hay actualizaciones", HTTP.BAD_REQUEST);    
        }else{
            const evento = await this.eventoRepository.findOne({ where: { id: id_evento } });
            const[campo] = ultimaActualizacion.campo;
            const[cambio] = ultimaActualizacion.cambio;
            const[accion] = ultimaActualizacion.accion;
            if(accion == "AnyadirInvitados"){
                const atiende = await this.atiendeRepository.findOne({ where: { evento: { id: id_evento }, usuario: { id: parseInt(cambio) } } });
                await this.atiendeRepository.remove(atiende);
            }else if(accion == "eliminarInvitados"){
                const atiende = this.atiendeRepository.create({ evento: { id: id_evento }, usuario: { id: parseInt(cambio) } });
                await this.atiendeRepository.save(atiende);
            }else{ //modificar
                if(typeof evento[campo] == 'string'){
                    evento[campo] = cambio;
                    }else if (typeof evento[campo] == 'number'){
                        evento[campo] = parseInt(cambio);
                    }
                await this.eventoRepository.save(evento);
            }
            
            return this.crearUpdatesCambio(id_evento, id_usuario,accion,cambio, campo, "Se ha deshecho el cambio del " + campo + " del evento " + id_evento + " al " + cambio + ".", new Date().toISOString());
        }
    }
}
