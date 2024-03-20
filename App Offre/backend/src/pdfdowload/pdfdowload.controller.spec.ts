import { Test, TestingModule } from '@nestjs/testing';
import { PdfdowloadController } from './pdfdowload.controller';

describe('PdfdowloadController', () => {
  let controller: PdfdowloadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfdowloadController],
    }).compile();

    controller = module.get<PdfdowloadController>(PdfdowloadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
