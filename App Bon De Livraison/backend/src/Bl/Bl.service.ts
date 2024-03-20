import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository,SelectQueryBuilder, getRepository } from 'typeorm';
import { Bl } from './Bl.entity';
import { CreateBlDto } from './DTO/CreateBl.dto';

import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/user.entity';
import { AuthService } from 'src/auth/auth.service';

import { ICustomPaginationOptions } from './DTO/ICustomPaginationOptions';



import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { parse } from 'uuid';
import * as uuid from 'uuid';
import * as crypto from 'crypto';


@Injectable()
export class BlService {
    //private readonly Bl:Bl[] = [];

    // Comunication with databse
    constructor(
        @InjectRepository(Bl)
        private blRepository: Repository<Bl>,
        private userService:AuthService,
        @InjectRepository(User)private userRepository:Repository<User>,
   

    ) { }



    async findOneById(id: number, relations?: string[]): Promise<Bl | undefined> {
      const query = this.blRepository.createQueryBuilder('bl').where('bl.id = :id', { id });
  
      if (relations) {
        relations.forEach(relation => {
          query.leftJoinAndSelect(`bl.${relation}`, relation);
        });
      }
  
      return query.getOne();
    }

    uuidv4ToInt(uuidValue: string): number {
        const numericValue = parseInt(crypto.createHash('sha256').update(uuidValue).digest('hex'), 16);
        return numericValue;
      }
 
      generateRandomNumber(min: number, max: number): number {
        // Generate a random number between min (inclusive) and max (exclusive)
        return Math.floor(Math.random() * (max - min) + min);
      }
      
      ref = (this.generateRandomNumber(1, 100)).toString();
      
      generateUniqueId(): number {
        // Get the current timestamp
        const timestamp = new Date().getTime();
      
        // Generate a random number (you may want to use a more sophisticated random number generator)
        const random = Math.floor(Math.random() * 1000);
      
        // Combine timestamp and random number to create a unique ID
        const uniqueId = parseInt(`${timestamp}${random}`, 10);
      
        return uniqueId;
      }

    // Creation BL
    async create(idUser:number ,createBlDto: CreateBlDto) {
        const user= await this.userService.findOneById(idUser);
        
      
       // const idd=uuidv4()
        const blId = this.generateUniqueId(); // Generate a unique ID for Bl

        const currentDate = new Date();
        const newBonDeLiv = this.blRepository.create({
          id:blId,
          dateBl: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          ),reference:this.ref,
          ...createBlDto,
          user
        });
    
        // Update the Destinataire with the new Bl
        const blname = `${newBonDeLiv.id}-${currentDate.toISOString().slice(0, 10)}`;
        const bl=await this.blRepository.save({blname:blname,...newBonDeLiv});
        return bl

      } 

    // find All BLs
    findAll(): Promise<Bl[]> {
        return this.blRepository.find();
    }

    // find BL by her id
    findOne(id: number): Promise<Bl | null> {
        return this.blRepository.findOneBy({ id });
    }

    // Delete BL
    async remove(id: number): Promise<void> {
        await this.blRepository.delete(id);
    }

   

    /*findBlByMonth(date: Date): Promise<Bl[]> {
        const month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-indexed months
    
        return this.createQueryBuilder('bl')
          .where('MONTH(bl.dateBl) = :month', { month })
          .getMany();
      }*/


    
    /*  async findColisByBlId(id:number): Promise<Colis>{
        const bl =await this.blRepository.findOneBy({id});
        const colisId=await this.colisRepository.findOne(bl.colis)
        return 
      }*/
      async findUserByBlId(blId: number): Promise<User | null> {
        const user = await this.userRepository
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.bonDeLiv', 'bl')
          .where('bl.id = :blId', { blId })
          .getOne();
    
        return user || null;
      }

      async getBlByUserId(userId: number): Promise<Bl[]> {
        return this.blRepository.find({ where: { user: { id: userId } } });
      }


      async paginate(userId: number, options: IPaginationOptions): Promise<Bl[]> {
        const queryBuilder = this.blRepository.createQueryBuilder('bl');
        queryBuilder.where('bl.userId = :userId', { userId });
        queryBuilder.orderBy('bl.dateBl', 'DESC');
      
        const paginationResult = await paginate<Bl>(queryBuilder, options);
        const items: Bl[] = paginationResult.items;
        return items;
      }

      async getBlByDate(userId: number,dateBl: Date, options: IPaginationOptions): Promise<Bl[]> {
        const queryBuilder = this.blRepository.createQueryBuilder('bl');
        queryBuilder.where('bl.userId = :userId AND bl.dateBl = :date', {userId,date: dateBl });
        const paginationResult = await paginate<Bl>(queryBuilder, options);
        const items: Bl[] = paginationResult.items;
        return items;
      }
      
   

      async getBlByDestinataire(userId: number,nomDest:string , options: IPaginationOptions):Promise<Bl[]>{
        const queryBuilder = this.blRepository.createQueryBuilder('bl');
        queryBuilder.where('bl.userId = :userId AND bl.nom_prenom = :dest', {userId, dest: nomDest });
        const paginationResult = await paginate<Bl>(queryBuilder, options);
        const items: Bl[] = paginationResult.items;
        return items;    
        }

        async getBlByGove(userId: number ,governorate:string , options: IPaginationOptions):Promise<Bl[]>{
          const queryBuilder = this.blRepository.createQueryBuilder('bl');
          queryBuilder.where('bl.userId = :userId AND bl.governorate= :name', {userId, name: governorate });
          const paginationResult = await paginate<Bl>(queryBuilder, options);
          const items: Bl[] = paginationResult.items;
          return items;          
           }


           async paginateFiltrage(userId: number, options: ICustomPaginationOptions): Promise<Bl[]> {
            const queryBuilder = this.blRepository.createQueryBuilder('bl');
            queryBuilder.where('bl.userId = :userId', { userId });
            if (options.filters && options.filters.dateBl) {
                queryBuilder.andWhere('bl.dateBl = :dateBl', { dateBl: options.filters.dateBl });
            }
            if (options.filters && options.filters.nomDest) {
                queryBuilder.andWhere('bl.nomDest = :nomDest', { nomDest: options.filters.nomDest });
            }
            if (options.filters && options.filters.blname) {
                queryBuilder.andWhere('bl.blname = :blname', { blname: options.filters.blname });
            }    
            const paginationResult = await paginate<Bl>(queryBuilder, options);
            const items: Bl[] = paginationResult.items;
            return items;
        }
    

}


