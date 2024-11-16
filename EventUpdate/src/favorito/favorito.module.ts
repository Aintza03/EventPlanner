import {Module} from '@nestjs/common';
import {FavoritoController} from './favorito.controller';
import {FavoritoService} from './favorito.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Favorito} from './favorito.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Favorito])],
    controllers: [FavoritoController],
    providers: [FavoritoService]
})
export class FavoritoModule {}