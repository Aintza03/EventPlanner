import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Evento } from '../evento/evento.entity';
@Entity()
export class Favorito {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => Usuario, usuario => usuario.favorito)
    usuario: Usuario;
    @ManyToOne(() => Evento, evento => evento.favorito)
    evento: Evento;
}