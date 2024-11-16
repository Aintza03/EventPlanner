import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
export class EventoUpdate extends Document {
  @Prop({required: true})
  id: string;

  @Prop({required: true})
  id_evento: number;

  @Prop({required: true})
  id_usuario: number;
  @Prop()
  cambio: string;
  @Prop()
  campo: string;
  @Prop()
  respuesta: string;
  @Prop ({required: true})
  accion: string;
  @Prop({required: true})
  descripcion: string; //texto
  @Prop({required: true})
    fecha: string;
}

export const EventoUpdateSchema = SchemaFactory.createForClass(EventoUpdate);