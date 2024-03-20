import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { User } from "src/user/user.entity";
import { EmailService } from "src/Email/email.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '3d' }
    }),
  ],
  providers: [AuthService, EmailService],
  controllers: [AuthController],
  exports:[AuthService],
})
export class AuthModule {}
