import {IsString, IsNotEmpty, IsNumber} from 'class-validator';

export class FavoritoDto {
    @IsNumber()
    @IsNotEmpty()
    idUsuario: number;
    @IsNumber()
    @IsNotEmpty()
    idEvento: number;
}