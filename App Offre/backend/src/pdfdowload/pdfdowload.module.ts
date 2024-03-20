import { Module } from '@nestjs/common';
import { PdfdownloadController } from './pdfdowload.controller';
import { PdfdownloadService } from './pdfdowload.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from 'src/auth/auth.service';

import { EmailService } from 'src/Email/email.service';
import { AuthModule } from 'src/auth/auth.module';



import { User } from 'src/user/user.entity';
import { BlService } from 'src/offre/Offre.service';
import { BlModule } from 'src/offre/Offre.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),AuthModule,BlModule],
  controllers: [PdfdownloadController],
  providers: [PdfdownloadService,AuthService,EmailService,BlService],
  exports:[PdfdownloadService],
})
export class PdfdowloadModule {}
