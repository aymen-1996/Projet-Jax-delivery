import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlService } from './Bl/Bl.service';
import { BlController } from './Bl/Bl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bl } from './Bl/Bl.entity';
import { BlModule } from './Bl/Bl.module';
import { ConfigModule } from '@nestjs/config';
import { UploadGroupeService } from './upload-groupe/upload-groupe.service';
import { UploadGroupeController } from './upload-groupe/upload-groupe.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PdfdowloadModule } from './pdfdowload/pdfdowload.module';
import { PdfdownloadService } from './pdfdowload/pdfdowload.service';

@Module({
  imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'baseBDL40',
        entities: [Bl, User],
 // synchronize: true, 
        //wakt database deja tabda creer naamel synchronise false 

    synchronize:false,
      }),
      BlModule,
  
      MulterModule.register({
        dest: './uploadsExcels', // Set your upload directory
      }),
      UserModule,
      AuthModule,
      JwtModule,
      PdfdowloadModule

  ],
  controllers: [AppController, BlController, UploadGroupeController, UserController],
  providers: [AppService, BlService, UploadGroupeService, UserService,JwtService,PdfdownloadService],
})
export class AppModule {}
 