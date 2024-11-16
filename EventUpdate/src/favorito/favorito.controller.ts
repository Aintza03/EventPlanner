import {Controller, Post, Body} from '@nestjs/common';
import {FavoritoService} from './favorito.service';
import {FavoritoDto} from './favoritodto';

@Controller('favorito')
export class FavoritoController {
    constructor(private readonly favoritoService: FavoritoService) {}

    @Post()
    async create(@Body() favorito: FavoritoDto) {
        return this.favoritoService.create(favorito);
    }
}