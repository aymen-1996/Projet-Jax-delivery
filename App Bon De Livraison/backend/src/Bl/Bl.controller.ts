import { Controller, Post, Get, Body, Param, Delete, ParseIntPipe,Res,DefaultValuePipe,Query } from '@nestjs/common';

import { BlService } from './Bl.service';
import { CreateBlDto } from './DTO/CreateBl.dto';
import { Bl } from './Bl.entity';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {join } from 'path';
import * as fs from 'fs';
import { readdirSync } from 'fs';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ICustomPaginationOptions } from './DTO/ICustomPaginationOptions';



  

@Controller('bl')
export class BlController {
    constructor(private BlService: BlService
    ) { }

    //Api findAll BLs
    @Get()
    findAll() {
        return this.BlService.findAll();
    }

    //API find BL by id 
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.BlService.findOne(+id)
    }

    //API Delete BL by ID
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.BlService.remove(id)
    }


    //getBdlbydestinataireName

 /*   @Get(':id/colis')
    findColidByBlId(@Param('id') id: number){
     return this.BlService.findColisByBlId(id);
    }*/

    @Get(':id/User')
    async findUserByUserId(@Param('id')userId: number){
        return this.BlService.findUserByBlId(userId)
    }


  /*  @Get(':id/')
    async savePDF(filePath: string, res: Response,@Param('id') id: number): Promise<void> {


      try {
          const buffer = fs.readFileSync(filePath);
    

          res.set({
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename=${filename}`,
              'Content-Length': buffer.length.toString(),
          });
    
          // Envoyer le fichier au client
          res.end(buffer);
    
          
          // Supprimer le fichier après l'envoi (facultatif)
          fs.unlinkSync(filePath);
    
      } catch (error) {
          // Gérer les erreurs de lecture du fichier
          console.error('Erreur lors de la lecture du fichier PDF:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
    }*/

    
    @Get(':idBl/createpdf')
    async generatePdf(@Param('idBl') idBl: number, @Res() res: Response) {
        try {

        const bl = await this.BlService.findOne(idBl);
        const user=await this.BlService.findUserByBlId(idBl);
      


        const fs = require("fs");
        const PDFDocument = require("pdfkit-table");
        const pdfDoc =new PDFDocument({ margin: 30, size: 'A4', });


        const leftColumnX = 50;
        const columnGap = 50;  // Adjust the gap between columns
        const rightColumnX = leftColumnX + columnGap;  // Calculate the X-coordinate for the right column
        const textOptions = {font:'Times-Roman',fontSize: 12};

        const image =user.logo;
        const x = 50;
        const y = 150;

        const imagePath = path.resolve(__dirname, '..', '..', 'uploads', image);
        

        const xUpperRight = pdfDoc.page.width - 120; // Adjust as needed
        const yUpperRight = 10; // Adjust as needed
        
        // Coordinates for the center
        const xCenter = pdfDoc.page.width / 2;
        const yCenter = pdfDoc.y;
        

        const formattedDate = bl.dateBl.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        pdfDoc
          .text(`Bon de Livraison No: ${bl.external_ref}`, { align: 'center', ...textOptions })
          .text(`Date d'enlévement:${formattedDate}`, { align: 'center',continued:true, ...textOptions })
          .text(' ',{align:'center'})
          .moveDown()
        // Information Destinataire
  
        // Information Expediteur
        pdfDoc.fontSize(10)
        .text(' ',{align:'center'})
        .text(' ',{align:'center'})
        .text(`Information Expéditeur`, {continued:true })
        .text(`Information Destinataire`,{align:'right' })
        .text(`Nom de l'expéditeur:${user.nom}`, {continued:true, align: 'left' })
        .text(`Nom de destinataire:${bl.nom_prenom}`,{align:'right' })
        .text(`Adresse:${user.adress}`, {continued:true, align: 'left' })  //adrees mf tel 
        .text(`Tél:${bl.tel1}`,{align:'right' })
        .text(`M.F:${user.matriculeFiscale}`, {continued:true, align: 'left'} ) 
        .text(`Adresse:${bl.adresse}`,{align:'right' })
        .text(`Tél:${user.phoneNumber}` ,{continued:true, align: 'left' })
        .text('',{align:'left'})
        .moveDown()
     
        // Référence transportaur
        pdfDoc
        .text(' ',{align:'left'})
        .text('Référence transporteur', { align: 'left', ...textOptions })
        .moveDown();
        // Now add content to the right colum

        const desc=bl.description.toString();

        const prix=bl.cr_bt.toString();

        const Livraison=user.fraisLivraison.toString();//user.frai

        const quantite=1. //bl.quantite.toString();

        const tableQuantite=quantite.toString();
       
        const addDivider = (x1, y1, x2, y2) => {
          pdfDoc
            .createPage([x2 - x1, 2]) // Assuming the line height is 2 (adjust as needed)
            .drawLine({
              start: { x: 0, y: 0 },
              end: { x: x2 - x1, y: 0 },
              color: rgb(0, 0, 0), // Adjust color as needed
              thickness: 1, // Adjust thickness as needed
            })
            .moveDown();
        };
        
        const addPadding = (text, x, y, options) => {
          pdfDoc.text(text, { x: x + 5, y, ...options }); // Adjust padding as needed
        };

        const name=(await this.BlService.findOne(idBl)).blname;
        
        let montant,prixTot,montant2,tva,ttc;

        if (name.startsWith('excel')){

           montant=((bl.cr_bt-user.fraisLivraison)*quantite).toString();
           prixTot=(bl.cr_bt*quantite).toString();
           montant2=(((bl.cr_bt*quantite))*0.81).toString();
           tva=(((bl.cr_bt * quantite) * 0.19).toFixed(3)).toString();
           ttc=(bl.cr_bt*quantite).toString();

        }else{  
          
          
           montant=(bl.cr_bt*quantite).toString();//cr_bt-user.livraison 

           prixTot=(bl.cr_bt*quantite+user.fraisLivraison).toString();//prixLiv =userFrais
  
          
           montant2=((bl.cr_bt*quantite)+user.fraisLivraison).toString();//montnat2*91%
    
           tva=(((bl.cr_bt*quantite)+user.fraisLivraison)*0.19).toString();//à demandé 
    
    
           ttc=((bl.cr_bt*quantite)+user.fraisLivraison+tva).toString();//somme montan2+tva
        }


        pdfDoc.font('Helvetica-Bold')
          // requires 
        const table = {
           title: "Désignation",
           divider: {
             header: { disabled: false},
             horizontal: { disabled: false, width: 1, opacity: 1 },
             padding: 5,
             columnSpacing: 10,
           },
           headers: [
            { label: "Description",headerColor:"#4253ed", headerOpacity:1  },
            { label: "TTC total",headerColor:"#4253ed", headerOpacity:1 },
          ],
           rows: [
             [`${bl.description}`,prixTot]
          ],
         };
         pdfDoc.table( table, { 
         //   A4 595.28 x 841.89 (portrait) (about width sizes)
         //  width: 300,
            columnsSize: [440,100 ],
            prepareHeader: () => pdfDoc.fontSize(10)
            .fill('black'),
            prepareRow: (row, indexColumn, indexRow, rectRow) => {
              pdfDoc.font("Helvetica-Bold").fontSize(8);
              indexColumn === 0 && pdfDoc.addBackground(rectRow, '#e6e8f5', 0.15);
            },
         }); 

    
        

         /* const width = pdfDoc.widthOfString('Dates pervisionelles');
          const height = pdfDoc.currentLineHeight(0);
         /* pdfDoc.fontSize(12)
          .font('Helvetica-Bold')
          .underline(20, 0, width, height)
          .text(`Dates pervisionelles`, { align: 'left'}) // Set font size to 16
            .moveDown();*/

pdfDoc.y=300;
        

          pdfDoc.fontSize(9)
          .font('Helvetica')
          .text(`Bon de Livraison No: ${bl.external_ref}`, { align: 'center'}) // Set font size to 18
            .moveDown();

          pdfDoc.fontSize(10)
          .font('Helvetica')
          .text('JAX delivery service', { align: 'left', continued: true }) // Set font size to 12
            .text(`Code: code`, { align: 'right' })
            .text('Téléphone: 31 170 140 ', { align: 'left', continued: true }) // Set font size to 12
            .text('codeQR', { align: 'right'  })
            .text('Adresse:', { align: 'left', continued: true }).text('Av. Taieb Mhiri 40 Bardo Tunis',{align:'left'}) 
            .moveDown();

         pdfDoc.lineWidth(2);
         //position
         const recyPosition = (pdfDoc.page.height/2)-20;//3aml 3al y =tul el page
         
         //Mesures 
         const widthShape=pdfDoc.page.width-40//3uredh
         const length=pdfDoc.page.height/9//tul


         const xWidth=pdfDoc.page.width
         const line=pdfDoc.page.width/2
         const yline=length+400

         //y el ktiba

         const text2 = [
          `Nom:${user.nom}`,
          `MF:${user.matriculeFiscale}`,
          `Adress:${user.gover}`,
          `Téléphone:${user.phoneNumber}`
        ];
        
        const text3 = [
          `Nom:${bl.nom_prenom}`,
          `Tel:${bl.tel1}`,
          `Address:${bl.adresse}`
        ];
        
        const textTitle2 = 'Information Expéditeur';
        const textTitle3 = 'Information Destinataire';
        
        const text = `${text2.join('\n')}\n\n\n${text3.join('\n')}`;
        
        pdfDoc.y = recyPosition + 10;
        
        pdfDoc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(textTitle2, { align: 'left', continued: true })
          .text('                                                 ', {continued: true})
          .text(textTitle3, { align: 'justify' });
        pdfDoc
          .fontSize(12)
          .font('Helvetica')
          .text(text, {
            x: 40,
            columns: 2,
            columnGap: 50,
            height: 85,
            align: 'justify'
          });
        
     
       
      pdfDoc
      .moveTo(line, recyPosition)
      .lineTo(line, yline)
      .lineJoin('round')
      .roundedRect(20, recyPosition, widthShape, length, 15)
      .stroke()
      .moveDown()
      .moveDown()
      .moveDown(); 

      pdfDoc.y = recyPosition+length+5;

     
  
   
    

      

      const table2 = {
        title: "",
        headers: [
         { label: "Description",headerColor:"#1765d1", headerOpacity:1  },
         { label: "Montant",headerColor:"#1765d1", headerOpacity:1 },
       ],
        rows: [
          [desc,montant2],
          ["TVA(19%)",tva],
          ["Total Montant TTC",ttc],
       ],
      };

      const columnWidths = [440, 100];

      const addVerticalLine = (x, y1, y2, color = rgb(0, 0, 0), thickness = 1) => {
        pdfDoc.drawLine({
          start: { x, y: y1 },
          end: { x, y: y2 },
          color,
          thickness,
        });
      };

      

      pdfDoc.moveDown()
      .moveDown()
      .moveDown()
      .table( table2, { 
      //   A4 595.28 x 841.89 (portrait) (about width sizes)
      //  width: 300,
         columnsSize: [ 440, 100 ],
         prepareHeader: () => pdfDoc.fontSize(10)
         .fill('black'),
         prepareRow: (row, indexColumn, indexRow, rectRow) => {
           pdfDoc.fontSize(10).font("Helvetica");
           indexColumn === 0 && pdfDoc.addBackground(rectRow, 'grey', 0.15);
           
         },
        
      }); 

      pdfDoc.moveDown(pdfDoc.height)
      .fontSize(9)
          .font('Times-Italic')
          .text(`Signatute`, { align: 'right'}) // Set font size to 18
          

        //pdfDoc.text(`Destinataire Data:\n${JSON.stringify(destinataire)}`);

        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');



        

        const formattedDateTime = `${bl.id}-${year}-${month}-${day}_${hours}-${minutes}`;
         // Format date as 'YYYY-MM-DD'
    
        // Set headers for PDF download
        const dirPath = path.resolve(process.cwd(), '../BonDeLivraison');
        const dirPath2 = path.resolve(process.cwd(), 'Downloads');



        console.log('Directory path:', dirPath);
  
        if (!fs.existsSync(dirPath)) {
          console.log('Creating directory: downloads');
          fs.mkdirSync(dirPath, { recursive: true });
        }
  
      // const filePathlocal = `pdfdata.pfd${Date.now()}.pdf`;
      const filePathlocal = path.resolve(dirPath,  formattedDateTime+'.pdf');
      const filePathserver = path.resolve(dirPath2,  formattedDateTime+'.pdf');

      
        console.log('File path:', filePathlocal );
  
        await new Promise<void>((resolve, reject) => {
          pdfDoc.pipe(fs.createWriteStream(filePathlocal, { mode: 0o644 }))
            .on('finish', () => {
              console.log('File writing finished');
        
              // Ensure that the destination directory exists
              if (!fs.existsSync(dirPath2)) {
                console.log('Creating directory: Downloads');
                fs.mkdirSync(dirPath2, { recursive: true });
              }
        
              // Now, copy the file to the second directory
              fs.copyFile(filePathlocal, filePathserver, (err) => {
                if (err) {
                  console.error('Error copying file:', err);
                  reject(err);
                } else {
                  console.log('File copied to second directory');
                  resolve();
                }
              });
            })
            .on('error', (error) => {
              console.error('File writing error:', error);
              reject(error);
            });
        
          pdfDoc.end();
        });
  
        console.log(`File path: ${filePathlocal }`);
  
        res.header('Content-Type', 'application/pdf');
        res.header('Content-Disposition', `attachment; filename=${formattedDateTime}`);
       // res.download(filePath);
       // res.json(bl.id);
        res.sendFile(filePathlocal);
        

      //  await this.savePDF(filePathlocal, res, formattedDateTime);
      return bl.id
      } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Destinataire not found' });
    }
  }



 

  @Post(':idUser/createbl')
  async create(@Param('idUser', ParseIntPipe) idUser: number, @Body() createBlDto: CreateBlDto, @Res() res: Response) {
    try {
        const bl = await this.BlService.create(idUser, createBlDto);
        await this.generatePdf(bl.id, res);
        res.json(bl.id);
        return bl;
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating BL or generating PDF' });
    }
  }
  @Get(':id/file')
  async downloadFile(@Param('id') id: number, @Res() res: Response) {
    // Assume files are stored in a directory named 'downloads'
    const directoryPath = join(process.cwd(), '../BonDeLivraison');

    // Get the list of files in the directory
    const files = readdirSync(directoryPath);

    // Find the file that matches the given id in its name
    const filename = files.find((file) => file.startsWith(`${id}-`));

    if (!filename) {
      // If no matching file is found, send an error response
      return res.status(404).send('File not found');
    }

    // Construct the full file path
    const filePath = join(directoryPath, filename);

    // Set the headers for the response
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}`,
    });

    // Send the file as the response
    res.sendFile(filePath);
  }



  @Get(':id/downloadImported')
  async downloadFileFromExcel(@Param('id') id: number, @Res() res: Response){
     const bl= await this.BlService.findOneById(id);
    
    await this.generatePdf(bl.id,res);
    
    
    const directoryPath = join(process.cwd(), '../BonDeLivraison');
        const files = readdirSync(directoryPath);

    // Find the file that matches the given id in its name
    const filename = files.find((file) => file.startsWith(`${id}-`));

    if (!filename) {
      // If no matching file is found, send an error response
      return res.status(404).send('File not found');
    }

    // Construct the full file path
    const filePath = join(directoryPath, filename);

    // Set the headers for the response
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}`,
    });

    // Send the file as the response
    res.sendFile(filePath);
    

  }

  @Get(':idUser/getAllBlByUser')
  async getBlByUserId(@Param('idUser') userId: number): Promise<Bl[]> {
    return await this.BlService.getBlByUserId(userId);
  }


  @Get(':idUser/getAllBlByUser/:page/:limit')
  async pagginate(@Param('idUser',new ParseIntPipe()) userId: number,
  @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number ,
): Promise<Bl[]> {
  const options: IPaginationOptions = {
    page,
    limit,
    route: `${userId}/getBLPagination`,
  };

  return this.BlService.paginate(userId, options);
}
  
    @Get(':idUser/:dest/getAllBlByDest/:page/:limit')
    async getBlByDest(@Param('idUser', ParseIntPipe) userId: number,
      @Param('dest') dest: string,
      @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number  ,
    ): Promise<Bl[]> {
      const options: IPaginationOptions = {
        page,
        limit,
        route: `${userId}/${dest}/getAllBlByDest`,
      };

      return this.BlService.getBlByDestinataire(userId,dest, options);
    }

    @Get(':idUser/:date/byDate/:page/:limit')
    async getBlByDate(@Param('idUser', ParseIntPipe) userId: number,
      @Param('date') dateString: Date,
      @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number ,
    ): Promise<Bl[]> {
      
      const options: IPaginationOptions = {
        page,
        limit,
        route: `${userId}/${dateString}/byDate`, 
      };

  return this.BlService.getBlByDate(userId,dateString, options);
}


  @Get(':idUser/:name/getAllBlByName/:page/:limit')
  async getBlByName(@Param('idUser', ParseIntPipe) userId: number,
    @Param('name') name: string,
    @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number ,
  ): Promise<Bl[]> {
    const options: IPaginationOptions = {
      page,
      limit ,
      route: `${userId}/${name}/getAllBlByName`, 
    };

  return this.BlService.getBlByGove(userId,name, options);
}

@Get(':idUser/getAllBlByUserFilter/:page/:limit')
async getBlByUserIdAndFiltrage(
  @Param('idUser', ParseIntPipe) userId: number,
  @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number,
  @Query('dateBl') dateBl?: Date,
  @Query('nomDest') nomDest?: string,
  @Query('blname') blname?: string, 
): Promise<Bl[]> {
  const options: ICustomPaginationOptions = {
    page,
    limit,
    route: `${userId}`,
    filters: {
      dateBl,
      nomDest,
      blname,
    },
  };

  return this.BlService.paginateFiltrage(userId, options);
}




}
function rgb(arg0: number, arg1: number, arg2: number) {
    throw new Error('Function not implemented.');
}

