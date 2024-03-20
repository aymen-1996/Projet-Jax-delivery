/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { facture } from './fact.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFactDto } from './DTO/CreateFact.dto';
import { User } from 'src/user/user.entity';
import { UserService } from '../user/user.service';
import { UpdateteFactDto } from './DTO/UpdateFact.dto';
import { ClientService } from '../client/client.service';

@Injectable()
export class FactService {
  constructor(
    @InjectRepository(facture) private factureRepository: Repository<facture>,
    private UserService: UserService,
    private ClientService: ClientService

  ) { }


  // creation facture neutre : sans client
  async createFacture(createFactDto: CreateFactDto): Promise<facture> {
    const factures = this.factureRepository.create(createFactDto,);
    return await this.factureRepository.save(factures);
  }

  // creation facture lier a un client 
  async CreateFacture(idCL: number, createFactDto: CreateFactDto): Promise<facture> {
    const client = await this.ClientService.findClientbyid(idCL);

    if (!client) {
      throw new Error(`User with ID ${idCL} not found`);
    }
   
    const fact = this.factureRepository.create({ ...createFactDto, client });
    const savedFacture = await this.factureRepository.save(fact);

    return savedFacture;
  }

  private async getOrderNumberForYearMonth(yearMonth: string): Promise<number> {
    const latestFacture = await this.factureRepository.findOne({
      order: { idF: 'DESC' },
      where: { numFact: Like(`${yearMonth}%`) },
    });

    let orderNumber = 1;

    if (latestFacture) {
      const latestYearMonth = latestFacture.numFact.slice(0, 6);
      if (latestYearMonth === yearMonth) {
        orderNumber = parseInt(latestFacture.numFact.slice(-3), 10) + 1;
      }
    }

    return orderNumber;
  }


  async generateFactureNumber(clientId: number): Promise<string> {
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const orderNumber = await this.getOrderNumberForYearMonth(currentYear + currentMonth);
    const factureNumber = `${currentYear}${currentMonth}${orderNumber.toString().padStart(3, '0')}`;

    return factureNumber;
  }

  // GetALL Factures
  async getAll(): Promise<facture[]> {
    return await this.factureRepository.find();
  }

  // Get facture by ID
  async getOneById(id: number): Promise<facture> {
    try {
      return await this.factureRepository.findOneOrFail({
        where: { idF: id },
      });
    } catch (err) {
      console.log('Error ', err.message ?? err);
      throw new HttpException(
        'Facture avec id ${id} not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  

  //update facture 
  async update(id: number, updateteFactDto: UpdateteFactDto): Promise<facture> {
    let facture = await this.factureRepository.findOneBy({
      idF: id,
    })
    // return facture ;
    facture = { ...facture, ...updateteFactDto, };
    return await this.factureRepository.save(facture);
  }

  /*//get factures par commercial:user
  async getFacturesByUser(userId: number): Promise<Facture[]> {
    const factures = await this.factureRepository.find();
    return factures;
  }*/

}