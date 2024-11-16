import { Test, TestingModule } from '@nestjs/testing';
import { EventoUpdateController } from './evento-update.controller';

describe('EventoUpdateController', () => {
  let controller: EventoUpdateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventoUpdateController],
    }).compile();

    controller = module.get<EventoUpdateController>(EventoUpdateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
