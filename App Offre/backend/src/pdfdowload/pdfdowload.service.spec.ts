import { Test, TestingModule } from '@nestjs/testing';
import { PdfdowloadService } from './pdfdowload.service';

describe('PdfdowloadService', () => {
  let service: PdfdowloadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfdowloadService],
    }).compile();

    service = module.get<PdfdowloadService>(PdfdowloadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
