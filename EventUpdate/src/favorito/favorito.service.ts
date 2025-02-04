import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Favorito } from "./favorito.entity";
import { FavoritoDto } from "./favoritodto";
@Injectable()
export class FavoritoService {
    constructor(
        @InjectRepository(Favorito)
        private favoritoRepository: Repository<Favorito>
    ) {}
    async create(favoritodto: FavoritoDto): Promise<Favorito> {
        const favorito = this.favoritoRepository.create({
            usuario: { id: favoritodto.idUsuario } as any,
            evento: { id: favoritodto.idEvento } as any,
        });
        return this.favoritoRepository.save(favorito);
    }
}