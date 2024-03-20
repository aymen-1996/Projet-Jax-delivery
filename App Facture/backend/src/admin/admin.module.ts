/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { admin } from './admin.entity';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { client } from 'src/client/client.entity';
import { facture } from '../fact/fact.entity';


@Module({
  imports: [TypeOrmModule.forFeature([client,User,admin,facture]),
  AdminModule],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [TypeOrmModule],

})
export class AdminModule {}
