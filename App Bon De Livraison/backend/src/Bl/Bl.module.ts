import { Module } from '@nestjs/common';
import { BlController } from './Bl.controller';
import { BlService } from './Bl.service';
import { Bl } from './Bl.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/Email/email.service';


@Module({

    imports: [TypeOrmModule.forFeature([Bl,User]),AuthModule,UserModule],
    providers: [BlService,AuthService,EmailService],
    controllers: [BlController],
    exports: [TypeOrmModule],


})
export class BlModule {}
