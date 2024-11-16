import {Controller, Post, Body} from '@nestjs/common';
import {UsuarioService} from './usuario.service';
import {UsuarioDto} from './usuariodto';

@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Post()
    async create(@Body() usuario: UsuarioDto) {
        return this.usuarioService.create(usuario);
    }
}