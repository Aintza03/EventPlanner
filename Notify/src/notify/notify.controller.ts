import {Controller, Get, Param, Headers, UnauthorizedException} from '@nestjs/common';
import {NotifyService} from './notify.service';
import {JwtService} from '@nestjs/jwt';

@Controller('notify')
export class NotifyController{
    constructor(private notifyService: NotifyService,
        private readonly jwtService: JwtService){}
    
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
    
    //Obtiene las ultimas notificaciones que ha recibido el usuario
    @Get('notificaciones/:idUsuario')
    async obtenerNotificaciones(@Param ('idUsuario') idUsuario: number, @Headers('Authorization') authHeader: string){
        const token = authHeader.replace('Bearer ', '');
        const decoded = this.verifyToken(token);
        console.log("Obteniendo notificaciones del usuario:",idUsuario);
        const res = this.notifyService.obtenerNotificaciones(idUsuario);
        return res;
    }
}