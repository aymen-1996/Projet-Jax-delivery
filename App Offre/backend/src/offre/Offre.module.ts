import { Module } from '@nestjs/common';
import { BlController } from './Offre.controller';
import { BlService } from './Offre.service';
import { Bl } from './Offre.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { AuthModule } from 'src/auth/auth.module';

import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/Email/email.service';


@Module({

    imports: [TypeOrmModule.forFeature([Bl,User]),AuthModule],
    providers: [BlService,AuthService,EmailService],
    controllers: [BlController],
    exports: [TypeOrmModule],


})
export class BlModule {}
