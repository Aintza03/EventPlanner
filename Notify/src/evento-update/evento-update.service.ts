import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventoUpdate } from './schemas/evento-update.schema';
import { EventoUpdateDto } from './evento-updatedto';

@Injectable()
export class EventoUpdateService {
  constructor(
    @InjectModel(EventoUpdate.name) private readonly eventoUpdateModel: Model<EventoUpdate>
  ) {}

  async crearUpdatesRespuesta(
    id_evento: number,
    id_usuario: number,
    accion: string,
    deshecho: number,
    respuesta: string,
    descripcion: string,
    fecha: string
  ): Promise<EventoUpdate> {
    const eventoUpdate = new this.eventoUpdateModel({
      id_evento,
      id_usuario,
      accion,
      deshecho,
      respuesta,
      descripcion,
      fecha,
    });
    return eventoUpdate.save();
  }
}