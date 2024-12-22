import { Controller, Post, Body } from '@nestjs/common';
import { EventoUpdateService } from './evento-update.service';
import { EventoUpdateDto } from './evento-updatedto';

@Controller('evento-update')
export class EventoUpdateController {
  constructor(private readonly eventoUpdateService: EventoUpdateService) {}

  @Post()
  async create(@Body() eventoUpdateDto: EventoUpdateDto) {
    return this.eventoUpdateService.crearUpdatesRespuesta(
      eventoUpdateDto.id_evento,
      eventoUpdateDto.id_usuario,
      eventoUpdateDto.accion,
      eventoUpdateDto.deshecho,
      eventoUpdateDto.respuesta,
      eventoUpdateDto.descripcion,
      eventoUpdateDto.fecha
    );
  }
}