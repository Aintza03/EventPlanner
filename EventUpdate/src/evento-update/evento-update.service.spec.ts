import { Test, TestingModule } from '@nestjs/testing';
import { EventoUpdateService } from './evento-update.service';

describe('EventoUpdateService', () => {
  let service: EventoUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventoUpdateService],
    }).compile();

    service = module.get<EventoUpdateService>(EventoUpdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
