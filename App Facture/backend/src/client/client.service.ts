/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { client } from './client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './DTO/CreateClient.dto';
import { UserService } from 'src/user/user.service';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ICustomPaginationOptions } from './DTO/ICustomPaginationOptions';
import { AdminModule } from '../admin/admin.module';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class ClientService {
  adminRepository: any;

  constructor(
    @InjectRepository(client) private clientRepository: Repository<client>,
    private UserService: UserService,
    private AdminService : AdminService 

  ) { }

// client cree par commercial
  async CreateClientbyUser(iduser: number, client: CreateClientDto): Promise<client> {
    const user = await this.UserService.findbyid(iduser);
    //const admin = await this.adminRepository.findbyid(idAdmin);

    if (!user) {
      throw new Error(`User with ID ${iduser} not found`);
    }
    const clientToCreate = this.clientRepository.create({ ...client, user });
    const createdClient = await this.clientRepository.save(clientToCreate);
    return createdClient;
     
  }

// client cree par admin
  async CreateClientbyAdmin(idadmin: number, client: CreateClientDto): Promise<client> {
    const admin = await this.AdminService.findbyid(idadmin);

    if (!idadmin) {
      throw new Error(`Admin with ID ${idadmin} not found`);
    }
    const clientToCreate = this.clientRepository.create({ ...client, admin });
    const createdClient = await this.clientRepository.save(clientToCreate);
    return createdClient;
     
  }
//listclientUser
  async getClientUser(userId: number, options: ICustomPaginationOptions): Promise<Pagination<client, IPaginationMeta>> {
    const queryBuilder = this.clientRepository.createQueryBuilder('client');
    queryBuilder.where('client.user = :userId', { userId });

    if (options.filters && options.filters.nomCL) {
      queryBuilder.andWhere('client.nomCL = :nomCL', { nomCL: options.filters.nomCL });
    }

    if (options.filters && options.filters.nomProjet) {
      queryBuilder.andWhere('client.nomProjet = :nomProjet', { nomProjet: options.filters.nomProjet });
    }

    if (options.filters && options.filters.mfCL) {
      queryBuilder.andWhere('client.mfCL = :mfCL', { mfCL: options.filters.mfCL });
    }

    const paginationResult = await paginate<client, IPaginationMeta>(queryBuilder, options);
    return paginationResult;
  }

  
  //listAllclient
  async getAllClient(
    options: ICustomPaginationOptions,
  ): Promise<Pagination<client, IPaginationMeta>> {
    const queryBuilder = this.clientRepository.createQueryBuilder('client');
    if (options.filters && options.filters.nomCL) {
      queryBuilder.andWhere('client.nomCL = :nomCL', { nomCL: options.filters.nomCL });
    }

    if (options.filters && options.filters.nomProjet) {
      queryBuilder.andWhere('client.nomProjet = :nomProjet', { nomProjet: options.filters.nomProjet });
    }

    if (options.filters && options.filters.mfCL) {
      queryBuilder.andWhere('client.mfCL = :mfCL', { mfCL: options.filters.mfCL });
    }

  
    const paginationResult = await paginate<client, IPaginationMeta>(queryBuilder, options);
    return paginationResult;
  }

  //listclientAdmin
  async getClientAdmin(AdminId: number, options: ICustomPaginationOptions): Promise<Pagination<client, IPaginationMeta>> {
    const queryBuilder = this.clientRepository.createQueryBuilder('client');
    queryBuilder.where('client.admin = :AdminId', { AdminId });

    if (options.filters && options.filters.nomCL) {
      queryBuilder.andWhere('client.nomCL = :nomCL', { nomCL: options.filters.nomCL });
    }

    if (options.filters && options.filters.nomProjet) {
      queryBuilder.andWhere('client.nomProjet = :nomProjet', { nomProjet: options.filters.nomProjet });
    }

    if (options.filters && options.filters.mfCL) {
      queryBuilder.andWhere('client.mfCL = :mfCL', { mfCL: options.filters.mfCL });
    }

    const paginationResult = await paginate<client, IPaginationMeta>(queryBuilder, options);
    return paginationResult;
  }


  //find client par son id 
  async findClientbyid(idCL: number): Promise<client> {
    try {
      const client = await this.clientRepository.findOne({
        where: { idCL },
      });

      if (!client) {
        throw new Error(`User with ID ${idCL} not found`);
      }

      return client;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  async findClientfactbyid(idCL: number): Promise<client> {
    try {
      const client = await this.clientRepository.findOne({
        where: { idCL },
      });

      if (!client) {
        throw new Error(`User with ID ${idCL} not found`);
      }

      return client;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

 // In the ClientService
async findClientByFactureId(factid: number): Promise<client | null> {
  try {
    const client = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.Factures', 'fact') // Note the uppercase 'F'
      .where('fact.idF = :factid', { factid })
      .getOne();

    return client || null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

  
  
  
  
  
  
  async updateClient(idCL: number, client: CreateClientDto): Promise<client | undefined> {
    try {
      await this.clientRepository.update(idCL, client);
      return this.clientRepository.findOne({ where: { idCL } });
    } catch (error) {
      console.error('Error updating client:', error.message);
      throw new Error('Failed to update client');
    }
  }


  async deleteClient(id:number):Promise<void>{
        await this.clientRepository.delete(id);
  }
  


}