/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { facture } from './fact.entity';
import { FactService } from './fact.service';
import { FactController } from './fact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserModule } from 'src/user/user.module';
import { client } from 'src/client/client.entity';
import { admin } from 'src/admin/admin.entity';
import { ClientService } from 'src/client/client.service';
import { AdminService } from 'src/admin/admin.service';
import { EmailService } from 'src/Email/sendEmail.service';


@Module({
    imports: [TypeOrmModule.forFeature([client,admin,User,facture]),
    UserModule],
    providers: [FactService,ClientService,AdminService , EmailService],
    controllers: [FactController],
    exports: [TypeOrmModule],
})
export class FactModule {}
