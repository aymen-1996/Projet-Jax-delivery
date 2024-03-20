import { Test, TestingModule } from '@nestjs/testing';
import { UploadGroupeService } from './upload-groupe.service';

describe('UploadGroupeService', () => {
  let service: UploadGroupeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadGroupeService],
    }).compile();

    service = module.get<UploadGroupeService>(UploadGroupeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
