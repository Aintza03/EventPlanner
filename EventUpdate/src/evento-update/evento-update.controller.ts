import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import {EventoUpdateService} from './evento-update.service';
@Controller('evento-update')
export class EventoUpdateController {
    constructor(private readonly eventoUpdateService: EventoUpdateService) {}
    @Get('')
    async hello(){
        console.log("Llega");
        return "Hello, this is the EventoUpdate service";
    }
    //Hace las actualizaciones de los eventos
    @Put('update/:id_evento')
    async updateEvento(@Param('id_evento') id_evento: number, @Body('id_usuario') id_usuario: number, @Body('accion') accion: string, @Body('cambio') cambio: string, @Body('campo') campo: string){
        console.log("Id del evento:",id_evento);
        const resultado = this.eventoUpdateService.updateEvento(id_evento, id_usuario ,accion, cambio, campo);
        return resultado;
    }
    //Guarda los cambios cuando un invitado acepta o rechaza
    @Post('respuestaInvitacion/:id_evento')
    async respuestaInvitacion(@Param('id_evento') id_evento: number, @Body('id_usuario') id_usuario: number, @Body('respuesta') respuesta: string){
        console.log("Id del evento:",id_evento, "Id del usuario:",id_usuario, "Respuesta:",respuesta);
        return this.eventoUpdateService.respuestaInvitacion(id_evento, id_usuario, respuesta);
    }
    //Deshace los cambios realizados
    @Post('deshacer/:id_evento')
    async deshacer(@Param('id_evento') id_evento: number){
        return this.eventoUpdateService.deshacerCambios(id_evento);
    }
}