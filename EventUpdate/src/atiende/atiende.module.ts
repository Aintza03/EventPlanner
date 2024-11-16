import {Module} from '@nestjs/common';
import {AtiendeController} from './atiende.controller';
import {AtiendeService} from './atiende.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Atiende} from './atiende.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Atiende])],
    controllers: [AtiendeController],
    providers: [AtiendeService]
})
export class AtiendeModule {}