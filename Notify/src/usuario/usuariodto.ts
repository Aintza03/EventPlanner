import {IsString, IsNotEmpty} from 'class-validator';

export class UsuarioDto {
    @IsString()
    @IsNotEmpty()
    nombreUsuario: string;

    @IsString()
    @IsNotEmpty()
    contrasena: string;

    @IsString()
    @IsNotEmpty()
    correo: string;
}