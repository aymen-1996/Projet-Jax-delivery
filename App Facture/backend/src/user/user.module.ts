/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { EmailService } from 'src/Email/sendEmail.service';

@Module({
  imports:[TypeOrmModule.forFeature([User])
],
  controllers: [UserController],
  providers: [UserService,EmailService],
  exports:[UserService],
})
export class UserModule {}
