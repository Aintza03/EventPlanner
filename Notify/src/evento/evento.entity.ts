import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Atiende } from '../atiende/atiende.entity';
import { Favorito } from '../favorito/favorito.entity';
@Entity()
export class Evento {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string; 
    @Column()
    fechaini: string;
    @Column()
    fechafin: string;
    @Column()
    lugar: string;
    @Column()
    descripcion: string;
    @Column()
    ultModificacion: string;
    @Column()
    idUsuario: number;
    @OneToMany(() => Atiende, atiende => atiende.evento)
    atiende: Atiende[];
    @OneToMany(() => Favorito, favorito =>favorito.evento)
    favorito: Favorito[];
}