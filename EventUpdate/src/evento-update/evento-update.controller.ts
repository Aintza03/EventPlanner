import { Controller, Post, Get, Put, Param, Body, Headers, UnauthorizedException } from '@nestjs/common';
import {EventoUpdateService} from './evento-update.service';
import {JwtService} from '@nestjs/jwt';
@Controller('evento-update')
export class EventoUpdateController {
    constructor(private readonly eventoUpdateService: EventoUpdateService, 
        private readonly jwtService: JwtService) {}
    
    private verifyToken(token: string) {
        console.log("verificando usuario");
        try {
            console.log('usuario verificado');
            return this.jwtService.verify(token, { secret: 'd0a0c1fd67fa5fca2c42e19692575f7c2f1299cc7cf0f0b378e85406d369dbcb' });
        } catch (error) {
            console.log('usuario no verificado');
            throw new UnauthorizedException('Invalid token');
        }
    }

    @Get('')
    async hello(){
        console.log("Llega");
        return "Hello, this is the EventoUpdate service";
    }
    //Hace las actualizaciones de los eventos
    @Put('update/:id_evento')
    async updateEvento(@Param('id_evento') id_evento: number, @Body('id_usuario') id_usuario: number, @Body('accion') accion: string, @Body('cambio') cambio: string, @Body('campo') campo: string, @Headers('Authorization') authHeader: string){
        const token = authHeader.replace('Bearer ', '');
        const decoded = this.verifyToken(token);
        console.log("Actualizando el evento:",id_evento);
        const resultado = this.eventoUpdateService.updateEvento(id_evento, id_usuario ,accion, cambio, campo);
        return resultado;
    }
    //Guarda los cambios cuando un invitado acepta o rechaza
    @Post('respuestaInvitacion/:id_evento')
    async respuestaInvitacion(@Param('id_evento') id_evento: number, @Body('id_usuario') id_usuario: number, @Body('respuesta') respuesta: string, @Headers('Authorization') authHeader: string){
        const token = authHeader.replace('Bearer ', '');
        const decoded = this.verifyToken(token);
        console.log('Guardando respuesta de la invitacion para el evento ',id_evento);
        return this.eventoUpdateService.respuestaInvitacion(id_evento, id_usuario, respuesta);
    }
    //Deshace los cambios realizados
    @Post('deshacer/:id_evento')
    async deshacer(@Param('id_evento') id_evento: number, @Headers('Authorization') authHeader: string){
        const token = authHeader.replace('Bearer ', '');
        const decoded = this.verifyToken(token);
        console.log('Deshaciendo cambios del evento ', id_evento);
        return this.eventoUpdateService.deshacerCambios(id_evento);
    }
}