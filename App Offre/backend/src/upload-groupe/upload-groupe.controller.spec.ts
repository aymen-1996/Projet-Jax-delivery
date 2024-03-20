import { Test, TestingModule } from '@nestjs/testing';
import { UploadGroupeController } from './upload-groupe.controller';

describe('UploadGroupeController', () => {
  let controller: UploadGroupeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadGroupeController],
    }).compile();

    controller = module.get<UploadGroupeController>(UploadGroupeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
