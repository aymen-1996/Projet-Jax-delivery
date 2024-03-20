/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from 'src/user/user.entity';
import { parse } from 'uuid';
import * as crypto from 'crypto';
import { admin } from 'src/admin/admin.entity';
import { CreateAdminDto } from 'src/admin/DTO/CreateAdmin.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  comparePasswords(password: string, password1: any) {
    throw new Error('Method not implemented.');
  }
    constructor( @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(admin) private readonly adminRepository:Repository<admin>
    ){}

 async findOne(email: string): Promise<User  | undefined> {
        try {
          const user = this.userRepository.findOne({ where: { email } });
          return user;
        } catch (error) {
          return undefined;
        }
      }
      async findOneAdmin(emailD:string):Promise<admin | undefined>{
        try{const admin = this.adminRepository.findOne({where:{emailD}})
        return admin;}
        catch(error){
          return undefined
        }
      }

      async validateUserPassword(user: User, password: string): Promise<boolean> {
        return user.password === password;
      }
    
      async validateAdminPassword(admin: admin, password: string): Promise<boolean> {
        return admin.passwordD === password;
      }
      
}
