/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller ,Post,Body, ConflictException,Res} from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';
import { Response} from 'express';
import { admin } from 'src/admin/admin.entity';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private jwtService: JwtService
      ) {}


//Login
@Post('login')
async login(
  @Body('email') email: string,
  @Body('password') password: string,
  @Res({ passthrough: true }) response: Response
): Promise<{ user: object | null, adminn: object | null, message: string, success: boolean }> {

  const user = await this.authService.findOne(email);
  const adminn = await this.authService.findOneAdmin(email);

  if (!user && !admin) {
    return { user: null, adminn: null, message: 'User not found!', success: false };
  }

  let entity: User | admin | null = null;

  if (adminn) {
    entity = adminn;
  }

  if (user) {
    entity = user;
  }

  if (user) {
    const isPasswordValid = await this.authService.validateUserPassword(user, password);

    if (!isPasswordValid) {
      return { user: null, adminn: null, message: 'Incorrect email or password!', success: false };
    }}

    if (admin) {
      const isPasswordValid = await this.authService.validateAdminPassword(adminn, password);

      if (!isPasswordValid) {
        return { user: null, adminn: null, message: 'Incorrect email or password!', success: false };
      }
    }


  return {
    user: entity instanceof User ? { id: entity.id, name: entity.name, email: entity.email } : null,
    adminn: entity instanceof admin ? { id: entity.id, email: entity.emailD } : null,
    success: true,
    message: 'User logged in successfully!',
  };
}




}