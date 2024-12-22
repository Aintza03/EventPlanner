import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Evento } from "./evento.entity";
import { EventoDto } from "./eventodto";
@Injectable()
export class EventoService {
    constructor(
        @InjectRepository(Evento)
        private eventoRepository: Repository<Evento>
    ) {}
    async create(eventodto: EventoDto): Promise<Evento> {
        const evento = this.eventoRepository.create(eventodto);
        return this.eventoRepository.save(evento);
    }
}