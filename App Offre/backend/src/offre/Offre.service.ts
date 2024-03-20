import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository,SelectQueryBuilder, getRepository } from 'typeorm';
import { Bl } from './Offre.entity';
import { CreateBlDto } from './DTO/CreateBl.dto';

import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { ICustomPaginationOptions } from './DTO/ICustomPaginationOptions';



import {
  paginate,
  Pagination,
  IPaginationOptions,
  IPaginationMeta,
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
    async create(idUser: number, createBlDto: CreateBlDto) {
      try {
        const user = await this.userService.findOneById(idUser);
    
        const blId = this.generateUniqueId();
        const currentDate = new Date();
    
        const newBonDeLiv = this.blRepository.create({
          id: blId,
          dateBl: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          ),
          reference: this.ref,
          ...createBlDto,
          user
        });
    
        // Update the Destinataire with the new Bl
        const blname = `${newBonDeLiv.id}-${currentDate.toISOString().slice(0, 10)}`;
        const bl = await this.blRepository.save({ blname: blname, ...newBonDeLiv, verified: false });
    
        return bl;
      } catch (error) {
        console.error(error);
        // Handle the error appropriately, e.g., by throwing or logging
        throw new Error('Error creating BL');
      }
    }
    
    async update(idBl: number, updateBlDto: CreateBlDto) {
      try {
        const existingBl = await this.blRepository.findOne({ where: { id: idBl } });
    
        if (!existingBl) {
          throw new Error('Bon de Livraison not found');
        }
    
        existingBl.matriculeFiscale = updateBlDto.matriculeFiscale ;
        existingBl.CIN = updateBlDto.CIN;
        existingBl.Mob = updateBlDto.Mob;
        existingBl.colisRetour = updateBlDto.colisRetour;
        existingBl.colisLivre = updateBlDto.colisLivre;
        existingBl.colisechange = updateBlDto.colisechange;
        existingBl.poids = updateBlDto.poids;
        existingBl.duree = updateBlDto.duree;
        existingBl.COD = updateBlDto.COD;
        existingBl.reference = updateBlDto.reference;
        existingBl.Fixe = updateBlDto.Fixe;
        existingBl.address = updateBlDto.address;
        existingBl.verified = true
    
        if (updateBlDto.dateBl) {
          existingBl.dateBl = new Date(updateBlDto.dateBl);
        }
    
        const updatedBl = await this.blRepository.save(existingBl);
    
        return updatedBl;
      } catch (error) {
        console.error(error);
        throw new Error('Error updating BL');
      }
    }
    
    
        
    
      
      

    // find All BLs
    async findAll( options: ICustomPaginationOptions): Promise<Pagination<Bl, IPaginationMeta>> {
      const queryBuilder = this.blRepository.createQueryBuilder('bl');
      if (options.filters && options.filters.dateBl) {
        queryBuilder.andWhere('bl.dateBl = :dateBl', { dateBl: options.filters.dateBl });
      }
      if (options.filters && options.filters.matriculeFiscale) {
        queryBuilder.andWhere('bl.matriculeFiscale = :matriculeFiscale', { matriculeFiscale: options.filters.matriculeFiscale });
      }
      if (options.filters && options.filters.reference) {
        queryBuilder.andWhere('bl.reference = :reference', { blname: options.filters.reference });
      }    
      
      const paginationResult = await paginate<Bl, IPaginationMeta>(queryBuilder, options);
      return paginationResult;
    
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
        queryBuilder.where('bl.userId = :userId AND bl.nomDest = :dest', {userId, dest: nomDest });
        const paginationResult = await paginate<Bl>(queryBuilder, options);
        const items: Bl[] = paginationResult.items;
        return items;    
        }

        async getBlByName(userId: number ,blname:string , options: IPaginationOptions):Promise<Bl[]>{
          const queryBuilder = this.blRepository.createQueryBuilder('bl');
          queryBuilder.where('bl.userId = :userId AND bl.gov= :name', {userId, name: blname });
          const paginationResult = await paginate<Bl>(queryBuilder, options);
          const items: Bl[] = paginationResult.items;
          return items;          
           }

           async paginateFiltrage(userId: number, options: ICustomPaginationOptions): Promise<Pagination<Bl, IPaginationMeta>> {
            const queryBuilder = this.blRepository.createQueryBuilder('bl');
            queryBuilder.where('bl.userId = :userId', { userId });
          
            if (options.filters && options.filters.dateBl) {
              queryBuilder.andWhere('bl.dateBl = :dateBl', { dateBl: options.filters.dateBl });
            }
          
            if (options.filters && options.filters.matriculeFiscale) {
              queryBuilder.andWhere('bl.matriculeFiscale = :matriculeFiscale', { matriculeFiscale: options.filters.matriculeFiscale });
            }
          
            if (options.filters && options.filters.reference) {
              queryBuilder.andWhere('bl.reference = :reference', { reference: options.filters.reference });
            }
                      queryBuilder.andWhere('bl.verified = :verified', { verified: false });
          
            const paginationResult = await paginate<Bl, IPaginationMeta>(queryBuilder, options);
            return paginationResult;
          }
          
          findOne(id: number): Promise<Bl | null> {
            return this.blRepository.findOneBy({ id });
        }
    
        // Delete BL
        async remove(id: number): Promise<void> {
            await this.blRepository.delete(id);
        }

  getNotValideBL(userId:number,valid:boolean):Promise<Bl[]>{
            return this.blRepository.find({ where: { user: { id: userId },verified:valid }})
          }



}

