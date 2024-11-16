import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "./usuario.entity";
import { UsuarioDto } from "./usuariodto";
@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>
    ) {}
    async create(usuariodto: UsuarioDto): Promise<Usuario> {
        const usuario = this.usuarioRepository.create(usuariodto);
        return this.usuarioRepository.save(usuario);
    }
}