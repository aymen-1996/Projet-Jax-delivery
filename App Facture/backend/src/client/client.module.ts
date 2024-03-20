/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { facture } from 'src/fact/fact.entity';
import { User } from 'src/user/user.entity';
import { client } from './client.entity';
import { admin } from 'src/admin/admin.entity';
import { UserService } from 'src/user/user.service';
import { FactService } from 'src/fact/fact.service';
import { AdminService } from 'src/admin/admin.service';
import { EmailService } from 'src/Email/sendEmail.service';

@Module({
  imports: [TypeOrmModule.forFeature([client,User,admin,facture]),
  ClientModule],
  providers: [ClientService, UserService,FactService,AdminService,EmailService],
  controllers: [ClientController],
  exports: [TypeOrmModule],
})
export class ClientModule {}
