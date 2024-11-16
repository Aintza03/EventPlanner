import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Evento } from '../evento/evento.entity';
@Entity()
export class Atiende {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => Usuario, usuario => usuario.atiende)
    usuario: Usuario;
    @ManyToOne(() => Evento, evento => evento.atiende)
    evento: Evento;
}