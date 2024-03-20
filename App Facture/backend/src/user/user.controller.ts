/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, ConflictException, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './DTO/CreateUser.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {

    constructor( private userService: UserService){}


    @Post('create')
    async createCommercial(@Body() commercial:CreateUserDto):Promise<User>{
        const existingUser = await this.userService.findOne(commercial.email);
        if (existingUser) {
          throw new ConflictException('Email already exists. Please use a different email');
        }
        return this.userService.createCommerciale(commercial);
    }

    @Get()
        async getAll():Promise<User[]>{
            return this.userService.getAll()
        }
        @Get(':id')
        async getByid(@Param('id')id:number):Promise<User>{
            
            return this.userService.findbyid(id)
        }

        @Delete(':id')
        async deleteComercial(@Param('id') id: number) {
          try {
            await this.userService.deleteCommercial(id);
            return { message: `User with ID ${id} successfully deleted` };
          } catch (error) {
            console.error(error);
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }

        @Put(':idC')
        async updateCommercial( @Param('idC') idC: number, @Body() user: CreateUserDto,): Promise<User | undefined> {
         try {
            const updatedUser = await this.userService.updateCommercial(idC,user);
      
            if (!updatedUser) {
              throw new NotFoundException(`User with ID ${idC} not found`);
            }
            return updatedUser;
          } catch (error) {
            console.error('Error updating commercial:', error);
            throw new Error('Failed to update commercial');
          }
        }

        @Post('forget-password')
        async forgetPassword(@Body('email') email: string): Promise<void> {
          try {
            await this.userService.forgetPassword(email);
          } catch (error) {
            console.error(`Error in forgetPassword endpoint: ${error.message}`);
            throw new Error('Failed to initiate password recovery');
          }
        }
        
    }

   

