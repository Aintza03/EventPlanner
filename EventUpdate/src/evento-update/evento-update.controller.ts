import { Controller, Post, Put, Param, Body } from '@nestjs/common';
import {EventoUpdateService} from './evento-update.service';
@Controller('evento-update')
export class EventoUpdateController {
    constructor(private readonly eventoUpdateService: EventoUpdateService) {}

    //Hace las actualizaciones de los eventos
    @Put('update/:id_evento')
    async updateEvento(@Param('id_evento') id_evento: number, @Body('id_usuario') id_usuario: number, @Body('accion') accion: string, @Body('cambio') cambio: string, @Body('campo') campo: string){
    return this.eventoUpdateService.updateEvento(id_evento, id_usuario,accion, cambio, campo);
    }
    //Guarda los cambios cuando un invitado acepta o rechaza
    @Post('respuestaInvitacion/:id_evento')
    async respuestaInvitacion(@Param('id_evento') id_evento: number, @Body('id_usuario') id_usuario: number, @Body('respuesta') respuesta: string){
        return this.eventoUpdateService.respuestaInvitacion(id_evento, id_usuario, respuesta);
    }
    //Deshace los cambios realizados
    @Post('deshacer/:id_evento')
    async deshacer(@Param('id_evento') id_evento: number, @Body('id_usuario') id_usuario: number){
        return this.eventoUpdateService.deshacerCambios(id_evento, id_usuario);
    }
}