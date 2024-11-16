import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Atiende } from "./atiende.entity";
import { AtiendeDto } from "./atiendedto";
@Injectable()
export class AtiendeService {
    constructor(
        @InjectRepository(Atiende)
        private atiendeRepository: Repository<Atiende>
    ) {}
    async create(atiendedto: AtiendeDto): Promise<Atiende> {
        const atiende = this.atiendeRepository.create(atiendedto);
        return this.atiendeRepository.save(atiende);
    }
}