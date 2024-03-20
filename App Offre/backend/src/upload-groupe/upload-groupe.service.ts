import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as exceljs from 'exceljs';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'uuid';
import * as uuid from 'uuid';
import * as crypto from 'crypto';
import { Workbook } from 'exceljs';
import { Bl } from '../offre/Offre.entity';
import { AuthService } from 'src/auth/auth.service';
import { map } from 'rxjs';

@Injectable()
export class UploadGroupeService {

    constructor(@InjectRepository(Bl)
    private blRepository: Repository<Bl>, private userService:AuthService){}
    
    //you don't need the function keywrd when using a function in a service 
    async readExcel(filePath: string) {
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(filePath);
      
        // Access worksheets and extract data
        const worksheet = workbook.getWorksheet(1);
        const data = worksheet.getSheetValues();
      
        return data;
      }

      
     uuidv4ToInt(uuidValue) {
      // Remove dashes and convert to lowercase
      //const hexString = uuidValue.replace(/-/g, '').toLowerCase();
    
      // Use parseInt with base 16 to convert hex to decimal
      //const uuidAsInt = parseInt(hexString, 16);
      const parsedUuid = parse(uuidValue);
      const numericValue = parseInt(crypto.createHash('md5').update(uuidValue).digest('hex'), 16);

      return numericValue;
    }



     generateUniqueId(): number {
      // Get the current timestamp
      const timestamp = new Date().getTime();
    
      // Generate a random number (you may want to use a more sophisticated random number generator)
      const random = Math.floor(Math.random() * 1000);
    
      // Combine timestamp and random number to create a unique ID
      const uniqueId = parseInt(`${timestamp}${random}`, 10);
    
      return uniqueId;
    }
    

    async saveDataFromExcel(id: number, data: any[]): Promise<void> {
      try {
        const user = await this.userService.findOneById(id);
    
        const generatedIds = this.generateUniqueId();
    
        const currentDate = new Date();
    
        const mapped = data.slice(2).map((row, index) => {
          const blname = `${generatedIds[index]}-${currentDate.toISOString().slice(0, 10)}`;
          return {
            id: generatedIds[index],
            dateBl: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
            ),
            user: user,
            matriculeFiscale:row[1] || '',
            CIN: row[2] || '',
            Mob: row[3],
            Fixe: row[4],
            address: row[5],
            colisLivre: row[6],
            colisRetour: row[7],
            colisechange: row[8],
            COD: row[9],
            duree: row[10],
            poids: row[11],
            verified:false ,
            reference: row[12],
            blname: blname, 
          };
        });
    
        const blImportes = await this.blRepository.save(mapped);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Error saving data from Excel.');
      }
    }
    
    async ExcelFile(): Promise<string> {
    
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('EXEL');
  
      // Add headers
      worksheet.addRow(['matriculeFiscale','CIN','Mob', 'Fixe', 'address', 'colisLivre', 'colisRetour', 'colisechange', 'COD','poids','duree' ,'reference']);
  
      // Save the workbook to a file
      const filePath = `exel_data.xlsx${Date.now()}.xlsx`;
      await workbook.xlsx.writeFile(filePath);
  
      return filePath;
    }


//creation exel file
    async downloadExelSheet(){
      let rows=[]
       //creation workbook
       let book = new Workbook();
       // add a woorksheet to workbook
       let sheet = book.addWorksheet('sheet1')
       // add the header
       rows.unshift((Object))
       //add multiple rows
       sheet.addRows(rows)
    
  }

}
