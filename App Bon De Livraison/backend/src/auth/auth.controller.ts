import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Put, Delete, Req, Res, UnauthorizedException, InternalServerErrorException, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { UseGuards } from '@nestjs/common';
import * as path from 'path';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import * as fs from 'fs';
import { JwtService } from "@nestjs/jwt";


@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService
  ) {
  }


  //logo n est pas obligatoire dans register
  @Post('register') //done
  @UseInterceptors(FileInterceptor('logo'))
  async register(
    @Body() user: User,
    @UploadedFile() logo?: Multer.File,
  ) {
    const hashedPassword = await bcrypt.hash(user.password, 12);

    let logoFileName: string | undefined;

    if (logo) {
      logoFileName = `${Date.now()}_${logo.originalname}`;
      const filePath = path.join(__dirname, '..', '..', 'uploads', logoFileName);
      await this.saveFile(logo.buffer, filePath);
    }

    const creatUser = await this.authService.create({
      ...user,
      password: hashedPassword,
      logo: logoFileName,
    });

    if (typeof creatUser === 'string') {
      // Handle the case where there was an error (e.g., email already exists)
      return { message: creatUser };
    }else{
     
      delete (creatUser as User).password;

  return creatUser;
    }
  
    // User created successfully
  
  }

  private saveFile(buffer: Buffer, filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      require('fs').writeFile(filePath, buffer, (error) => {
        if (error) {
          console.error(`Error saving file at ${filePath}: ${error.message}`);
          reject(error);
        } else {
          console.log(`File saved successfully at ${filePath}`);
          resolve();
        }
      });
    });
  }

  // modify return values => we need all informations like (errors, transcation succes or not,the logged user)
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ user: object | null, message: string, token: string, succes: boolean }> {

    const user = await this.authService.findOne(email);

    if (!user) {
      return { user: null, message: 'user not found !', succes: false, token: '' }
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return { user: null, message: 'wrong password !!', succes: false, token: '' }
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      user: {
        id: user.id,
        name: user.nom,
        email: user.email,
        phoneNumber: user.phoneNumber
      },
      token: jwt,
      succes: true,
      message: 'user logged in successfully !',
    };
  }


  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success'
    }
  }


  //pour aff log user
  //@UseGuards(JwtAuthGuard): pour que cette méthode ça marche seulement aprés login
  @Get('image/:userId')
  @UseGuards(JwtAuthGuard)
  async serveImage(@Param('userId') userId: number, @Res() res: Response) {
    const user = await this.authService.findOneById(userId);

    if (user && user.logo) {
      const filename = user.logo;
      const imagePath = path.join(__dirname, '..', '..', 'uploads', filename);

      const exists = require('fs').existsSync(imagePath);

      if (exists) {
        res.sendFile(imagePath);
      } else {
        throw new NotFoundException('Image not found');
      }
    } else {
      throw new NotFoundException('User not found');
    }
  }


  //change logo
  @Put(':iduser/update-logo')
  @UseInterceptors(FileInterceptor('logo'))
  async updateLogo(
    @Param('iduser') iduser: number,
    @UploadedFile() logo?: Multer.File,
  ) {
    const user = await this.authService.findOneById(iduser);

    if (!user) {
      return { message: 'User not found' };
    }

    if (logo) {
      if (user.logo) {
        // Check if the old logo exists in the "uploads" folder
        const oldLogoPath = path.join(__dirname, '..', '..', 'uploads', user.logo);
        if (fs.existsSync(oldLogoPath)) {
          // Delete old logo in folder uploads
          await this.deleteFile(oldLogoPath);
        }
      }

      const logoFileName = `${Date.now()}_${logo.originalname}`;
      const filePath = path.join(__dirname, '..', '..', 'uploads', logoFileName);
      await this.saveFile(logo.buffer, filePath);

      user.logo = logoFileName;

      const updatedUser = await this.authService.updateLogo(user.id, logoFileName);

      return updatedUser;
    } else {
      return { message: 'No logo provided' };
    }
  }



  //delete old logo
  private async deleteFile(filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      require('fs').unlink(filePath, (error) => {
        if (error) {
          console.error(`Error deleting file at ${filePath}: ${error.message}`);
          reject(error);
        } else {
          console.log(`File deleted successfully at ${filePath}`);
          resolve();
        }
      });
    });
  }


  //changer password par user
  @Put(':iduser/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Param('iduser') iduser: number,
    @Body() body: { oldPassword: string; newPassword: string; confirmPassword: string },
  ) {
    const user = await this.authService.findOneById(iduser);

    if (!user) {
      return { message: 'User not found' };
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      body.oldPassword,
      user.password,
    );

    if (!isOldPasswordCorrect) {
      return { message: 'Incorrect old password' };
    }

    if (body.newPassword !== body.confirmPassword) {
      return { message: 'New password and confirm password do not match' };
    }

    const hashedPassword = await bcrypt.hash(
      body.newPassword,
      12,
    );

    try {
      await this.authService.updatePassword(user.id, hashedPassword);

      console.log('Password updated successfully');
      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error updating password:', error.message);
      return { message: 'Error updating password' };
    }
  }


  // send code reset by mail
  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string): Promise<{ message: string }> {
    try {
      await this.authService.requestPasswordReset(email);
      return { message: 'Code reset password sendsuccessful. Please check your email .' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'An internal server error occurred',
      });
    }
  }

  // update password with reset code 
  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('resetCode') resetCode: number,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    try {
      await this.authService.resetPassword(email, resetCode, newPassword);
      return { message: 'Password reset successful. You can now log in with your new password.' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'An internal server error occurred',
      });
    }
  }


  @Get('/finduser/:id')//te5dem
  findUser(@Param('id') id: number) {
    return this.authService.findOneById(id);
  }
}
