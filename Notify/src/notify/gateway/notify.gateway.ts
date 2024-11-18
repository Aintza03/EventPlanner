import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody} from '@nestjs/websockets';
import {Server} from 'socket.io';

@WebSocketGateway()
export class NotifyGateway{
    @WebSocketServer()
    servidor: Server;
    //envia las notificaciones cuando ocurren
    notificar(idUsuario: number, evento: string, data: any){
        this.servidor.to(idUsuario.toString()).emit(evento, data);
    }  
}