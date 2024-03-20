/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { User } from "../user/user.entity";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { admin } from 'src/admin/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, admin]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '3d' }
    }),
  ],  
    providers: [AuthService],
    controllers: [AuthController],
    exports:[AuthService],
})
export class AuthModule {}
