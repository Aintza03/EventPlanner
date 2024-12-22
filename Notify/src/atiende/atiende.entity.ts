import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Evento } from '../evento/evento.entity';
@Entity()
export class Atiende {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Evento, evento => evento.atiende)
    @JoinColumn({ name: 'idEvento' })
    evento: Evento;

    @ManyToOne(() => Usuario, usuario => usuario.atiende)
    @JoinColumn({ name: 'idUsuario' })
    usuario: Usuario;

    @Column()
    status: string;
}