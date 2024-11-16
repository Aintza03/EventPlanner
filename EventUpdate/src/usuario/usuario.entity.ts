import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Atiende } from '../atiende/atiende.entity';
import { Favorito } from '../favorito/favorito.entity';
@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({unique: true})
    nombreUsuario: string;
    @Column()
    contrasena: string; 
    @Column({unique: true})
    correo: string;
    @OneToMany(() => Atiende, atiende => atiende.usuario)
    atiende: Atiende[];
    @OneToMany(() => Favorito, favorito => favorito.usuario)
    favorito: Favorito[];
}