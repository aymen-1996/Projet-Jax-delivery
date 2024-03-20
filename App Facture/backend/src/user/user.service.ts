/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './DTO/CreateUser.dto';
import { promises } from 'fs';
import { EmailService } from 'src/Email/sendEmail.service';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User)private userRepository:Repository<User> ,private emailService:EmailService){}
    
    async findbyid(id: number): Promise<User> {
        try {
          const user = await this.userRepository.findOne({
            where: { id },
          });
      
          if (!user) {
            throw new Error(`User with ID ${id} not found`);
          }
      
          return user;
        } catch (error) {
          throw new Error(`Error finding user: ${error.message}`);
        }
      }

      async findOne(email: string): Promise<User | undefined> {
        try {
          const user = this.userRepository.findOne({ where: { email } });
          return user;
        } catch (error) {
          return undefined;
        }
      }
    
async createCommerciale(user: CreateUserDto): Promise<User> {
    try {
      const commercial = this.userRepository.create(user);
      const createdUser = await this.userRepository.save(commercial);
      return createdUser;
    } catch (error) {
      console.error(error);
  
     }
  }

  async findClientByUser(id:number):Promise<User | undefined>{
    try{
        const user = this.userRepository.findOne({where:{id},
            relations:['clients']
        })

            if (!user) {
            throw new Error(`User with ID ${id} not found`);
          }
        return user
    }
   catch(error){
    return undefined
   }
}

async getAll():Promise<User[]>{
    return this.userRepository.find()
}

async deleteCommercial(id : number):Promise<void>{
    await this.userRepository.delete(id)
}
  
async updateCommercial(id: number, user: CreateUserDto): Promise<User | undefined> {
    try {
      await this.userRepository.update(id, user);
      return this.userRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error updating commercial:', error);
      throw new Error('Failed to update commercial');
    }
  }


  async forgetPassword(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
  
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
  
      const password = user.password;
      const text = `Hi ${user.name}\n Your password is: ${password}`;
    this.emailService.sendEmail(email, 'Password Recovery', text);
  
      console.log(`Password recovery email sent successfully to ${email}`);
    } catch (error) {
      console.error(`Error recovering password: ${error.message}`);
      throw new Error('Failed to recover password');
    }
  }
  
  
}
