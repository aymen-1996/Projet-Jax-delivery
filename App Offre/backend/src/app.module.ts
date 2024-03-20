import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlService } from './offre/Offre.service';
import { BlController } from './offre/Offre.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bl } from './offre/Offre.entity';
import { BlModule } from './offre/Offre.module';
import { ConfigModule } from '@nestjs/config';
import { UploadGroupeService } from './upload-groupe/upload-groupe.service';
import { UploadGroupeController } from './upload-groupe/upload-groupe.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UserService } from './user/user.service';

import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PdfdowloadModule } from './pdfdowload/pdfdowload.module';
import { PdfdownloadService } from './pdfdowload/pdfdowload.service';
import { EmailService } from './Email/email.service';

@Module({
  imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'baseOffre',
        entities: [Bl, User],
  synchronize: false, 
        //wakt database deja tabda creer naamel synchronise false 
//synchronize:false,
      }),
      BlModule,
  
      MulterModule.register({
        dest: './uploadsExcels', // Set your upload directory
      }),
   
      AuthModule,
      JwtModule,
      PdfdowloadModule

  ],
  controllers: [AppController, BlController, UploadGroupeController],
  providers: [AppService, BlService, UploadGroupeService, UserService,JwtService,PdfdownloadService,EmailService],
})
export class AppModule {}
 