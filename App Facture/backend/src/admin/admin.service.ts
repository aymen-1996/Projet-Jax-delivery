import { Injectable, OnModuleInit } from '@nestjs/common';
import { admin } from './admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService implements OnModuleInit {
    constructor(
        @InjectRepository(admin) private adminRepository: Repository<admin>,
    ) {}

    async onModuleInit() {
        await this.createDefaultAdmins();
    }
    
    private async createDefaultAdmins(): Promise<void> {
      await this.createDefaultAdmin('admin@admin.com', 'admin', 'admin');
      await this.createDefaultAdmin('mohmaeddhiabensaad@gmail.com', 'mohmaeddhia123', 'mohmaeddhiabensaad');
      await this.createDefaultAdmin('akrem.mejri.imfmm@gmail.com', 'akrem123', 'akrem mejri');
      await this.createDefaultAdmin('d.commercial@jax-delivery.com', 'commercial123', 'd.commercial');
      await this.createDefaultAdmin('hello@jax-delivery.com', 'hello123', 'hello');
  }
  
  private async createDefaultAdmin(email: string, password: string, nomD: string): Promise<void> {
      const existingAdmin = await this.findOne(email);
  
      if (!existingAdmin) {
          const defaultAdmin: admin = {
              nomD: nomD,
              statut: 'active',
              emailD: email,
              passwordD: password,
              id: 0,
              clients: []
          };
  
          await this.adminRepository.save(defaultAdmin);
      }
  }
  
  async findOne(emailD: string): Promise<admin | undefined> {
      try {
          const user = await this.adminRepository.findOne({ where: { emailD } });
          return user;
      } catch (error) {
          return undefined;
      }
  }
  
  
    async findbyid(id: number): Promise<admin> {
        try {
          const admin = await this.adminRepository.findOne({
            where: { id },
          });
      
          if (!admin) {
            throw new Error(`User with ID ${id} not found`);
          }
      
          return admin;
        } catch (error) {
          throw new Error(`Error finding admin: ${error.message}`);
        }
      }



}