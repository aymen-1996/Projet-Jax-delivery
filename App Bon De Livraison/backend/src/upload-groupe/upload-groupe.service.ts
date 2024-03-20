import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as exceljs from 'exceljs';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'uuid';
import * as uuid from 'uuid';
import * as crypto from 'crypto';
import { Workbook } from 'exceljs';
import { Bl } from '../Bl/Bl.entity';
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

    async saveDataFromExcel(id:number,data: any[]) {

      const user= await this.userService.findOneById(id);
      // Generate IDs for Destinataire and Colis
      const generatedIds = this.generateUniqueId()

     

      const currentDate = new Date()
      const idbl=Date.now()
    
      // Map Excel data to Destinataire entity model, starting from the third row
      const mapped = data.slice(2).map((row,index) => ({
        id:generatedIds[index],
        dateBl: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        ),
        delegation:'',
        quantite: 1,
        user: user,

        external_ref: row[1]  ,
        nom_prenom: row[2] ,
        tel1:  row[3]  ,
        tel2: row[4]  ,
        echange: row[5]  ,
        // ... other fields
        adresse: row[6]  ,
        governorate: row[7] ,
         // Default value
         // Default value
        cr_bt: row[8]  ,
        description:row[9] ,
       
      }));
      // Map Excel data to Colis entity model, starting from the fourth row
     
      console.log(mapped)
      const deepPartialMapped: DeepPartial<Bl>[] = mapped;
      console.log(deepPartialMapped)
// Save to the database
    const bl= this.blRepository.create(deepPartialMapped);
    console.log(bl)
    
    const blimportes=await this.blRepository.save(mapped);
     const updatePromises = blimportes.map(async (blEntity, index) => {
    const blname = `excel-${blEntity.id}-${currentDate.toISOString().slice(0, 10)}`;
    return this.blRepository.update(blEntity.id, { blname });
  });

  const updateResults: UpdateResult[] = await Promise.all(updatePromises);

      // Save to the databas
     
   
    }

    async ExcelFile(): Promise<string> {
    
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('EXEL');
  
      // Add headers


      worksheet.addRow(['external_ref', 'nom_prenom','tel1','tel2','echange', 'adresse','governorate','cr_bt','description']);


  
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
