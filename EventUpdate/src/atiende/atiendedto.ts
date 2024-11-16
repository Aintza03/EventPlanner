import {IsString, IsNotEmpty, IsNumber} from 'class-validator';

export class AtiendeDto {
    @IsNumber()
    @IsNotEmpty()
    idUsuario: number;
    @IsNumber()
    @IsNotEmpty()
    idEvento: number;
}