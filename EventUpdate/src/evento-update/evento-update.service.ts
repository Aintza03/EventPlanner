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
    constructor(
        @InjectModel(EventoUpdate.name) private eventoUpdateModel: Model<EventoUpdate>,
        @InjectRepository(Evento) private eventoRepository: Repository<Evento>,
        @InjectRepository(Atiende) private atiendeRepository: Repository<Atiende>    
    ) {}

    private async crearUpdatesCambio(id_evento: number, id_usuario: number, accion: string, deshecho: number,cambio: string, campo: string, descripcion: string, fecha:string): Promise<EventoUpdate> {
        const eventoUpdate = new this.eventoUpdateModel({
            id_evento: id_evento,
            id_usuario: id_usuario,
            accion: accion,
            deshecho: deshecho,
            cambio: cambio,
            campo: campo,
            descripcion: descripcion,
            fecha: fecha,
        });
        await eventoUpdate.save();
        console.log("Se ha añadido una entrada al log");
        return eventoUpdate;
    }
    private async crearUpdatesRespuesta(id_evento: number, id_usuario: number, accion: string, deshecho: number, respuesta: string, descripcion: string, fecha:string): Promise<EventoUpdate> {
        const eventoUpdate = new this.eventoUpdateModel({
            id_evento: id_evento,
            id_usuario: id_usuario,
            accion: accion,
            deshecho: deshecho,
            respuesta: respuesta,
            descripcion: descripcion,
            fecha: fecha,
        });
        await eventoUpdate.save();
        console.log("Se ha añadido una entrada al log");
        return eventoUpdate;
    }

    //funcion que actualiza un campo concreto del evento y luego llama a crearUpdates
    async updateEvento(id_evento: number, id_usuario: number, accion: string, cambio: string, campo: string): Promise<EventoUpdate> {
        const evento = await this.eventoRepository.findOne({ where: { id: id_evento } });
        
        //siempre encuentra evento
        if(accion == "AnyadirInvitados"){
            const atiende = this.atiendeRepository.create({ evento: { id: Number(id_evento) }, usuario: { id: parseInt(cambio)},status: 'Pending'  });
            await this.atiendeRepository.save(atiende);
            console.log("Se ha guardado el cambio de anadir invitados");
        }else if(accion == "eliminarInvitados"){
            const atiende = await this.atiendeRepository.findOne({ where: { evento: { id: id_evento }, usuario: { id: parseInt(cambio) } } });
            await this.atiendeRepository.remove(atiende);
            console.log("Se ha guardado el cambio de eliminar invitados.");
        }else{
            evento[campo] = cambio;
            await this.eventoRepository.save(evento);
            console.log("Se ha guardado el cambio de modificar evento.");
        }
        return this.crearUpdatesCambio(id_evento, id_usuario, accion,0, cambio, campo,"Se ha cambiado el " + campo + " del evento " + id_evento + " al " + cambio + ".", new Date().toISOString());
    }
    //funcion que guarda los cambios cuando un invitado acepta o rechaza
    async respuestaInvitacion(id_evento: number, id_usuario:number, respuesta: string): Promise<EventoUpdate> {
        console.log("Llega a llamar");
        const atiende = await this.atiendeRepository.findOne({ where: { evento: { id: id_evento }, usuario: { id: id_usuario } } });
        console.log("Llama a la base de datos");
        if(respuesta == "Aceptado"){
            console.log("Se ha aceptado el evento");
            atiende.status = "Aceptado";
            await this.atiendeRepository.save(atiende);
            return this.crearUpdatesRespuesta(id_evento, id_usuario, "responder",0,respuesta,"El usuario "+ id_usuario + " ha aceptado la invitacion al evento " + id_evento + ".", new Date().toISOString());
        }else if(respuesta == "Rechazado"){
            await this.atiendeRepository.remove(atiende);
            console.log("Se ha rechazado el evento");
            return this.crearUpdatesRespuesta(id_evento, id_usuario,"responder",0,respuesta, "El usuario " + id_usuario+ " ha rechazado la invitacion al evento " + id_evento + ".", new Date().toISOString());
        }else{
            //throw error
            throw new HttpException("Respuesta no valida", HTTP.BAD_REQUEST);
        }
    }
    //Deshace los cambios realizados en un evento
    async deshacerCambios(id_evento: number): Promise<EventoUpdate> {
        const ultimaActualizacion = await this.eventoUpdateModel.findOne({ id_evento, campo: { $exists: true, $ne: null}, cambio: { $exists: true, $ne: null }, deshecho: {$ne: 1}}).sort({ fecha: -1 }).exec();
        if(!ultimaActualizacion){
            throw new HttpException("No hay actualizaciones", HTTP.BAD_REQUEST);    
        }else{
            const evento = await this.eventoRepository.findOne({ where: { id: id_evento } });
            const campo = ultimaActualizacion.campo;
            const cambio = ultimaActualizacion.cambio;
            const accion = ultimaActualizacion.accion;
            const id_usuario = ultimaActualizacion.id_usuario;
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
            console.log("Se ha deshecho el cambio");
            return this.crearUpdatesCambio(id_evento, id_usuario,accion,1,cambio, campo, "Se ha deshecho el cambio del " + campo + " del evento " + id_evento + " al " + cambio + ".", new Date().toISOString());
        }
    }
}
