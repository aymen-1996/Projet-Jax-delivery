import { Controller, Post, Get, Body, Param, Delete, ParseIntPipe,Res,DefaultValuePipe,Query, Put, ValidationPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { BlService } from './Offre.service';
import { CreateBlDto } from './DTO/CreateBl.dto';
import { Bl } from './Offre.entity';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {join } from 'path';
import * as fs from 'fs';
import { readdirSync } from 'fs';
import { IPaginationMeta, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ICustomPaginationOptions } from './DTO/ICustomPaginationOptions';
import { EmailService } from 'src/Email/email.service';
import { EmailInfo } from './DTO/EmailInfo';


  

@Controller('bl')
export class BlController {
    constructor(private BlService: BlService,
      private emailService:EmailService
    ) { }

    @Get('/allofferes/:page/:limit')
    findAll( @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number,
    @Query('dateBl') dateBl?: Date,
    @Query('matriculeFiscale') matriculeFiscale?: string,
    @Query('reference') reference?: string ): Promise<Pagination<Bl, IPaginationMeta>> {
      const options: ICustomPaginationOptions = {
        page,
        limit,
        filters: {
          dateBl,
          matriculeFiscale,
          reference,
        },
      };

        return this.BlService.findAll(options);
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


        const fs = require('fs');
        const PDFDocument = require("pdfkit-table");
        const pdfDoc =new PDFDocument({ margin: 30, size: 'A4', });


        const leftColumnX = 50;
        const columnGap = 50;  // Adjust the gap between columns
        const rightColumnX = leftColumnX + columnGap;  // Calculate the X-coordinate for the right column
        const textOptions = {font:'Times-Roman',fontSize: 12};

        
        const image ='jax.png';

        
      
        const imagePath = path.resolve(__dirname, '..', '..', 'uploads', image);
        
        const xUpperRight = 0;
        const yUpperRight = 0;
        const fullWidth = pdfDoc.page.width;


               
         pdfDoc
               .image(imagePath, xUpperRight, yUpperRight, { width: fullWidth });

        const x = 50;
        const y = 150;

      pdfDoc.y=10;
      pdfDoc.fillColor('white').text('Matricule Fiscale',{align: 'right'}).moveDown(0.5);
      pdfDoc.fillColor('#a89413').text(`1667460L/A/M/000`,{align: 'right'});

        // Adjust as needed
        // Adjust as needed
        
        
      
        // Coordinates for the center

        const formattedDate = bl.dateBl.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });


        const site=""
       
        // Information Destinataire
  
        const [value, identifierType] = await bl.getNonEmptyIdentifier();
        console.log(value);  // The actual value (either this.MF or this.CIN)
        console.log(identifierType); 
        // Information Expediteur
        pdfDoc.fillColor('black').font('Times-Roman').fontSize(10)
        .text(' ',{align:'center'})
        .text(' ',{align:'center'})
        .text(`Nom:${bl.reference}              `,{align:'right' })
        .text(`Tunis,Le ${formattedDate}`, { align: 'left' ,continued:true})
        .text(`Mob:${bl.Mob}              `,{align:'right' })
        .text(`${identifierType} :${value}`, {continued:true, align: 'left'} )   
        .text(`                                                                 Email:`, { align: 'center' ,continued:true,})
        .fillColor('blue')
        .text('d.commercial@jax-delivery.com', {
          align: 'right',
          link: 'mailto:d.commercial@jax-delivery.com',
        }).fillColor('black')  
        .text(`Fix:${bl.Fixe}`, { align: 'left',continued:true })  
        .text(`                                                                                                        site:`,{align:'center',continued:true}).fillColor('blue').text('wwww.jax-delivery.com',{align:'right',link: 'https://jax-delivery.com/',}).fillColor('black')
        .moveDown()
     
        // Référence transportaur
        
        const pargraph="JAX EXPEDITION, entreprise totalement tunisienne, est ravie de vous présenter des solutions de transport adaptées à vos besoins, à travers son service de livraison express (JAX DELIVERY SERVICES) vous pouvez expédier nimporte où à l’intérieu du territoire Tunisien dans un délais maximum (transit time) de 72h après l’enlèvement du colis."
        
        pdfDoc.fontSize(12).font('Times-Roman')
        .text(' ',{align:'left'})
        .text(pargraph, { align: 'left', ...textOptions })
        .moveDown();

        pdfDoc.fontSize(12).font('Times-Roman').text("    JAX DELIVERY SERVICES,").moveDown();



        const pargraph2="     Met à votre disposition un parc de véhicules adaptés au transport urgent de vos colis, ainsi qu’une équipe de coursiers chevronnés équipés de moyens de communication modernes et un système d’information fiable permettant le traitement rapide de vos livraisons.Vos colis seront accompagnés de justificatifs de livraison. (Étiquette de transport ou bien bon de livraison)"
        // Now add content to the right colu
        
        pdfDoc.fontSize(12).font('Times-Roman').text(pargraph2).moveDown();


         /* const width = pdfDoc.widthOfString('Dates pervisionelles');
          const height = pdfDoc.currentLineHeight(0);
         /* pdfDoc.fontSize(12)
          .font('Times-Roman-Bold')
          .underline(20, 0, width, height)
          .text(`Dates pervisionelles`, { align: 'left'}) // Set font size to 16
            .moveDown();*/

            


          pdfDoc.fontSize(14)
          .font('Times-Bold')
            .text(`Tarifs JAX DELIVERY SERVICES : (en TTC)`, { align: 'left'})
            .moveDown().moveDown(); // Set font size to 14
            const recyPosition = (pdfDoc.page.height/3)+40;

        
         //position
            pdfDoc.y = (pdfDoc.page.height/3)+25 ;
          
         //3aml 3al y =tul el page
         pdfDoc.lineWidth(1);
         //Mesures 
         const widthShape=pdfDoc.page.width-200//3uredh
         const length=(pdfDoc.page.height/7)+10//tul
    
          const line=(pdfDoc.page.width/3)
          const line1=widthShape/2
          const line2=widthShape/4
          const line3=widthShape/5
          const yline=length+320
          console.log("yline =" ,yline)
          console.log("recyPosition=",recyPosition)
          console.log("line=",line)



         const xWidth=pdfDoc.page.width

         //y el ktiba
        const text3 = [
          `               ${bl.poids} kgMax`
        ];
        
        const textTitle2 = '   Tout le territoire Tunisien';
      
        
        const l=line+30
       const w=widthShape-40
        pdfDoc.x=50;
        pdfDoc
        .moveDown(1.5)
        .fontSize(12)
          .font('Times-Roman')
          .text(`      Tarif:   ${bl.colisLivre}   /colis livré                                   `, {align:'center'})
          .text('', {align:'center'})
          .text('', {align:'center'})
          .font('Times-Bold')
          .text(textTitle2, {align:'left'})
          .text('', {align:'center'})
          .text('', {align:'center'})
          .font('Times-Roman')
          .text(`          Tarif:   ${bl.colisRetour}   /colis retour                                     `, {align:'center'})
          .text('', {align:'center'})
          .text('', {align:'center'})
          .font('Times-Bold')
          .text(text3, { align:'left',lineGap: 5})
          .font('Times-Roman')
          .text(`        Tarif:   ${bl.colisechange}   /colis échange                               `, {align:'center',lineGap: 16 })
          .text(`       Tarif:   ${bl.COD}   /COD                                          `, {align:'center'})
          ;

          pdfDoc.moveTo(recyPosition+125, l+124)
          .lineTo(xWidth -397, l+124)
          .stroke();
          pdfDoc.moveTo(recyPosition+125, l+153)
          .lineTo(xWidth -397, l+153)
          .stroke();
          pdfDoc.moveTo(recyPosition+125, l+183)
          .lineTo(xWidth -397, l+183)
          .stroke();
      
  
          const recy = recyPosition+30;

      pdfDoc.moveDown()
      .moveTo(line, recyPosition)
      .lineTo(line,yline )
      .lineJoin('round')
      .rect(50, recyPosition, widthShape, length)
      .stroke()
      .moveDown()
      .moveDown(); 

       // Set font size to 18
          

       pdfDoc.fontSize(14)
       .font('Times-Bold')
       .text('Zones de couverture & Délais de livraison :', {align:'left'}).
       moveDown();

       pdfDoc.fontSize(12)
       .font('Times-Bold')
       .text('•   Zone du GRAND TUNIS', {align:'left'}).font('Times-Roman').
       text('     Tunis, Ben Arous, Ariana, Manouba, Zaghouan, Bizerte.',{continued:true}).fillColor('#0d9436').text(' Transit time 24/48h').fillColor('black')
       .font('Times-Bold').text('•    Zone du GRAND SAHEL', {align:'left'}).font('Times-Roman').
       text('     Nabeul, Sousse, Monastir, Mahdia.',{continued:true}).fillColor('#0d9436') .text('Transit time 24/48',).fillColor('black').
       font('Times-Bold').text('•    Zone du NORD OUEST', {align:'left'}).font('Times-Roman').
       text('     Beja, Jendouba, Kef, Siliana.',{continued:true}).fillColor('#0d9436') .text('Transit time 24/72h',).fillColor('black').
       font('Times-Bold').text('•    Zone du CENTRE', {align:'left'}).font('Times-Roman').
       text('     Sfax, Kairouan, Sidi Bouzid, Kasserine, Gabes.',{continued:true}).fillColor('#0d9436').text('Transit time 24/72h',).fillColor('black').
      font('Times-Bold'). text('•    Zone du SUD', {align:'left'}).font('Times-Roman').
       text('     Gafsa, Tozeur, Kébili, Médenine, Tataouine.',{continued:true}).fillColor('#0d9436').text('Transit time 24/72h',).fillColor('black').
       moveDown();
                
      pdfDoc.fontSize(14).font('Times-Bold').text('Termes et conditions', {align:'left'}).moveDown();

      const text1=' 3 passages de livraison (si nécessaire) pour chaque expédition';
      const textt2=' Suivie des colis en temps réel via un système d’information web'
      const textt3=' Gestion des réclamations (tickets) en temps réel via un système d’information web'
      const textt4=' Suivi du recouvrement en temps réel via un système d’information web'
      const textt5=`Versement des montants collectés dans le compte de l’expéditeur à raison de ${bl.duree} fois / semaine (RIB à fournir).`
      const textt6='Remboursement de 100% de la valeur de la marchandise par envoi perdu ou endommagé.'
      const textt7='Une Assurance RC sur l’ensemble des colis endommagés pouvons allez jusqu’à 50 milles dinars.'

      pdfDoc.font('Times-Roman').fontSize(12).list([text1,
        textt2,
        textt3,
        textt4,
        textt5,
        textt6,
        textt7], 30, 670, {
        // this is how automatic line wrapping will work if the width is specified
        width: 550,
        align: 'left',
        listType: 'bullet',
        bulletRadius: 1.5, // use this value to almost hide the dots/bullets
      });


     
            pdfDoc.moveDown().fontSize(10).font('Times-Bold').text('      Signature et cachet du client');
            pdfDoc.font('Times-Italic').text('         Précédées de la mention « Bon pour accord »')
            const recyPositionSigh = (pdfDoc.page.height/2)-170;

            const lineSign=(pdfDoc.page.width/2)+495
            const ylineSign=recyPositionSigh+410
      
            pdfDoc.lineWidth(0.2);
            pdfDoc.moveDown()
                  .moveTo( recyPositionSigh,lineSign)
                  .lineTo(ylineSign,lineSign )
                  .lineJoin('round').stroke();
      

        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');



        

        const formattedDateTime = `${bl.id}-${year}-${month}-${day}_${hours}-${minutes}`;
         // Format date as 'YYYY-MM-DD'
    
        // Set headers for PDF download
        const dirPath = path.resolve(process.cwd(), '../Offre');
        const dirPath2 = path.resolve(process.cwd(), 'downloads');


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
   

        return filePathlocal;

      } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Destinataire not found' });
    }
  }




 
  @Post(':idUser/createbl')
  async create(
    @Param('idUser', ParseIntPipe) idUser: number,
    @Body() createBlDto: CreateBlDto,
    @Body('emailInfo') emailInfo: EmailInfo,
    @Res() res: Response,
  ) {
    try {
      const bl = await this.BlService.create(idUser, createBlDto );
  // Inside BlService.create method
      const pdfContent = await this.generatePdf(bl.id, res);
        if (!pdfContent) {
        console.error('Error generating PDF content');
        return res.status(500).json({ message: 'Error generating PDF content' });
      }
  
      if (emailInfo.recipientEmail) {
        const combinedRecipientEmails = emailInfo.recipientEmail + ',' + bl.user.email;
        res.json({ blId: bl.id });
    
        this.emailService.sendEmailWithAttachment(
            combinedRecipientEmails,
            'Pdf Offre',
            `Hello, here is the PDF for the offer with the following details:`,
            pdfContent,
        );
    }
     else {
        res.json({ blId: bl.id });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating BL or generating/sending PDF' });
    }
  }
 


  @Put(':id')
async updateBonDeLivraison(
  @Param('id') idBl: number,
  @Body() updateBlDto: CreateBlDto,
) {
  try {
   
    const updatedBl = await this.BlService.update(idBl, updateBlDto);

    return updatedBl;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw new NotFoundException('Bon de Livraison not found');
    }

    console.error(error);
    throw error;
  }
}

  
  




  
  @Get(':id/file')
  async downloadFile(@Param('id') id: number, @Res() res: Response) {
    // Assume files are stored in a directory named 'downloads'
    const directoryPath = join(__dirname,'..','..' ,'Downloads');

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
    
    
    const directoryPath = join(__dirname,'..','..' ,'Downloads');
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
        limit: 10,
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

  return this.BlService.getBlByName(userId,name, options);
}

@Get(':idUser/getAllBlByUserFilter/:page/:limit')
async getBlByUserIdAndFiltrage(
  @Param('idUser', ParseIntPipe) userId: number,
  @Param('page', ParseIntPipe) page: number,@Param('limit', ParseIntPipe) limit: number,
  @Query('dateBl') dateBl?: Date,
  @Query('matriculeFiscale') matriculeFiscale?: string,
  @Query('reference') reference?: string, 
  ): Promise<Pagination<Bl, IPaginationMeta>> {
    const options: ICustomPaginationOptions = {
      page,
      limit,
      route: `${userId}`,
      filters: {
        dateBl,
        matriculeFiscale,
        reference,
      },
    };

  return this.BlService.paginateFiltrage(userId, options);

}

@Get(':idUser/GetOffreValidation/:valid/:page/:limit')
getNotValideBL(@Param('idUser', ParseIntPipe) userId: number,valid:boolean):Promise<Bl[]>{
  return this.BlService.getNotValideBL(userId,!valid);
}




}
function rgb(arg0: number, arg1: number, arg2: number) {
    throw new Error('Function not implemented.');
}

