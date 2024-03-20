/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FactController } from './fact/fact.controller';
import { FactService } from './fact/fact.service';
import { FactModule } from './fact/fact.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import{facture} from './fact/fact.entity'
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import{UserController} from './user/user.controller'
import{User} from './user/user.entity';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ClientModule } from './client/client.module';
import { client } from './client/client.entity';
import { ClientService } from './client/client.service';
import { ClientController } from './client/client.controller';
import { AdminModule } from './admin/admin.module';
import { admin } from './admin/admin.entity';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { EmailService } from './Email/sendEmail.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'BDFacture',
        entities: [facture,User,client,admin],
        synchronize: false, 
      }),

       FactModule,
       UserModule,
       AuthModule,
       ClientModule,
       AdminModule
      ],

  controllers: [AppController, FactController,UserController,ClientController,AdminController,AuthController],
  providers: [AppService, FactService, UserService,ClientService,AdminService , EmailService,AuthService,JwtService],
})
export class AppModule {}
