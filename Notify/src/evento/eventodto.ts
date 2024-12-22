import {IsString, IsNotEmpty, IsNumber} from 'class-validator';

export class EventoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
    @IsString()
    @IsNotEmpty()
    descripcion: string;
    @IsString()
    @IsNotEmpty()
    lugar: string;
    @IsString()
    @IsNotEmpty()
    fechaIni: string;
    @IsString()
    @IsNotEmpty()
    fechaFin: string;
    @IsString()
    @IsNotEmpty()
    ultmod: string;
    @IsNumber()
    @IsNotEmpty()
    usuario: number;
}