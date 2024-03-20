/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './DTO/CreateClient.dto';
import { client } from './client.entity';
import { IPaginationMeta, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ICustomPaginationOptions } from './DTO/ICustomPaginationOptions';

@Controller('client')
export class ClientController {
constructor(private readonly clientService: ClientService) {}

// client cree par commercial
@Post('user/:id')
async createbyuser(@Param('id') iduser: number ,@Body() client: CreateClientDto): Promise<client> {
  try {
    return this.clientService.CreateClientbyUser(iduser,client);
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

// client cree par admin
@Post('admin/:id')
async createbyAdmin(@Param('id') idadmin: number ,@Body() client: CreateClientDto): Promise<client> {
  try {
    return this.clientService.CreateClientbyAdmin(idadmin,client);
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


@Get('user/:idUser/getAllByUser/:page/:limit')
async getClientByUser(
  @Param('idUser', ParseIntPipe) userId: number,
  @Param('page', ParseIntPipe) page: number,
  @Param('limit', ParseIntPipe) limit: number,
  @Query('nomCL') nomCL?: string,
  @Query('nomProjet') nomProjet?: string,
  @Query('mfCL') mfCL?: string,
): Promise<Pagination<client, IPaginationMeta>> {
  const options: ICustomPaginationOptions = {
    page,
    limit,
    route: `${userId}`,
    filters: {
      nomCL,
      nomProjet,
      mfCL,
    },
  };

  return this.clientService.getClientUser(userId, options);
}


@Get('getAllClient/:page/:limit')
async getAllClient(
  @Param('page', ParseIntPipe) page: number,
  @Param('limit', ParseIntPipe) limit: number,
  @Query('nomCL') nomCL?: string,
  @Query('nomProjet') nomProjet?: string,
  @Query('mfCL') mfCL?: string,
): Promise<Pagination<client, IPaginationMeta>> {
  const options: ICustomPaginationOptions = {
    page,
    limit,
    filters: {
      nomCL,
      nomProjet,
      mfCL,
    },
  };

  return this.clientService.getAllClient(options);
}
@Get('admin/:idAdmin/getAllByAdmin/:page/:limit')
async getClientByAdmin(
  @Param('idAdmin', ParseIntPipe) idAdmin: number,
  @Param('page', ParseIntPipe) page: number,
  @Param('limit', ParseIntPipe) limit: number,
  @Query('nomCL') nomCL?: string,
  @Query('nomProjet') nomProjet?: string,
  @Query('mfCL') mfCL?: string,
): Promise<Pagination<client, IPaginationMeta>> {
  const options: ICustomPaginationOptions = {
    page,
    limit,
    route: `${idAdmin}`,
    filters: {
      nomCL,
      nomProjet,
      mfCL,
    },
  };

  return this.clientService.getClientAdmin(idAdmin, options);
}
@Put(':id')
async updateClient(@Param('id') idCL: number, @Body() client: CreateClientDto): Promise<client | undefined> {
  return this.clientService.updateClient(idCL, client);
}

@Delete(':id')
async deleteClient(@Param('id') id:number){
  this.clientService.deleteClient(id)
}

@Get(':id/Client')
async getClientById(@Param('id') id:number){
  return this.clientService.findClientbyid(id)
}
}