import {Controller, Post, Body} from '@nestjs/common';
import {EventoService} from './evento.service';
import {EventoDto} from './eventodto';

@Controller('evento')
export class EventoController {
    constructor(private readonly eventoService: EventoService) {}

    @Post()
    async create(@Body() evento: EventoDto) {
        return this.eventoService.create(evento);
    }
}