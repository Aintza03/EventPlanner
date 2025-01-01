import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Evento} from '../evento/evento.entity';
import {Usuario} from '../usuario/usuario.entity';
import {Atiende} from '../atiende/atiende.entity';
import {Favorito} from '../favorito/favorito.entity';
import { EventoUpdate, EventoUpdateSchema } from '../evento-update/schemas/evento-update.schema';

@Injectable()
export class NotifyService{
    constructor(@InjectModel(EventoUpdate.name) private eventoUpdateModel: Model<EventoUpdate>,
    @InjectRepository(Evento) private eventoRepository: Repository<Evento>,
    @InjectRepository(Atiende) private atiendeRepository: Repository<Atiende>){}
    
    async obtenerNotificaciones(idUsuario: number): Promise<EventoUpdate[]> {
        try {
            const invitaciones = await this.atiendeRepository.find({ where: { usuario: { id: idUsuario } } });
            console.log(invitaciones);
            if(invitaciones.length === 0 || invitaciones == null){
                return this.eventoUpdateModel.find({ id_usuario: idUsuario }).sort({ fecha: -1 }).limit(100).exec();
            }
            console.log("Devolviendo invitaciones");
            const ids = invitaciones.map(invitacion => invitacion.id);
            return this.eventoUpdateModel.find({$or: [{ id_usuario: idUsuario },{ id_evento: { $in: ids } }]}).sort({ fecha: -1 }).limit(100).exec();
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Error al obtener las notificaciones');
        }
    }
}
