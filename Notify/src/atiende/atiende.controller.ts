import {Controller, Post, Body} from '@nestjs/common';
import {AtiendeService} from './atiende.service';
import {AtiendeDto} from './atiendedto';

@Controller('atiende')
export class AtiendeController {
    constructor(private readonly atiendeService: AtiendeService) {}

    @Post()
    async create(@Body() atiende: AtiendeDto) {
        return this.atiendeService.create(atiende);
    }
}