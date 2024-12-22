import {Controller, Get, Param} from '@nestjs/common';
import {NotifyService} from './notify.service';

@Controller('notify')
export class NotifyController{
    constructor(private notifyService: NotifyService){}
    //Obtiene las ultimas notificaciones que ha recibido el usuario
    @Get('notificaciones/:idUsuario')
    async obtenerNotificaciones(@Param ('idUsuario') idUsuario: number){
        const res = this.notifyService.obtenerNotificaciones(idUsuario);
        return res;
    }
}