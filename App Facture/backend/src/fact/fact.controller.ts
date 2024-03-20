/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, ParseIntPipe, Param, ValidationPipe, Patch, UsePipes, HttpException, HttpStatus, UseInterceptors, UploadedFiles, Res, InternalServerErrorException } from '@nestjs/common';
import { FactService } from './fact.service';
import { CreateFactDto } from './DTO/CreateFact.dto';
import { facture } from './fact.entity';
import { UpdateteFactDto } from './DTO/UpdateFact.dto';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { ClientService } from 'src/client/client.service';

import { Response } from 'express';
import { Email } from './DTO/Email';
import { EmailService } from 'src/Email/sendEmail.service';


//espace stockage file serveur 
export const Storage = {
  storage: diskStorage({
      destination: './downloads/',
      filename: async (req, file, cb) => {
              try {
                console.log('file:', file);
                if (file && file.originalname && typeof file.originalname === 'string' ) {
                  const filename: string = path.parse(file.originalname).name.replace(/\s/g, '');
                  const extention: string = path.parse(file.originalname).ext;
                  console.log('filename:', filename);
                  console.log('extention:', extention);
                  cb(null, `${filename}${extention}`);
                } else {
                  console.error("Le fichier est indéfini ou n'a pas de propriété 'originalname'.");
                  cb(null, null);
                }
              } catch (error) {
                console.error("Une erreur est survenue lors de la génération du nom de fichier:", error);
                cb(error, null);
              }
            }             
  })
}

@Controller('fact')
export class FactController {
  constructor(private readonly factService: FactService ,private clientService:ClientService , private emailService:EmailService) { }

  //localhost:3000/fact/create
  // creation facture neutre 
  @Post('/create')
  create(@Body() createFactDto: CreateFactDto): Promise<facture> {
    return this.factService.createFacture(createFactDto);
  }

  //creation fact liee a un client par id client : localhost:3000/fact/1
  @Post(':idCL')
async createFact(
  @Param('idCL') idCL: number,
  @Body() createFactDto: CreateFactDto,
 @Body('emailInfo') emailInfo: Email,
  @Res() res: Response,
): Promise<facture> {
  try {
    const fact = await this.factService.CreateFacture(idCL, createFactDto);

    const pdfContent = await this.generatePdf(fact.idF, res);
     if (!pdfContent) {
        console.error('Error generating PDF content');
        return null
      }
  
      if (fact) {
        res.json({ factId: fact.idF});
          
        ;
    }
     else {
      res.json({ factId: fact.idF});
      }

  } catch (error) {
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Get('generateFactureNumber/:id')
async generateFactureNumber(@Param('id') id: number): Promise<{ factureNumber: string }> {
  try {
    const generatedFactureNumber = await this.factService.generateFactureNumber(id);
    return { factureNumber: generatedFactureNumber };
  } catch (error) {
    console.error('Error generating facture number:', error);
    throw new InternalServerErrorException('Internal Server Error');
  }
} controller

  // get all factures : localhost:3000/fact
  @Get()
  async GetAll(): Promise<facture[]> {
    return this.factService.getAll();
  }

  // Get one facture by id : localhost:3000/fact/1
  @Get('id')
  async GetOne(@Param('id', ParseIntPipe) id: number): Promise<facture> {
    return this.factService.getOneById(id);
  }

  //localhost:3000/fact/1
  @Patch(':id')
  @UsePipes(ValidationPipe)
  async Update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateteFactDto: UpdateteFactDto): Promise<facture> {
    return this.factService.update(id, updateteFactDto)
  }

  //download facture en pdf :
  //Upload file PDF , APi : http://localhost:3000/fact/pdf
  @Post('pdf')
  @UseInterceptors(AnyFilesInterceptor(Storage))
  async UploadMultiplesFiles(@UploadedFiles() files, @Body() Body) {
      console.log(Body.adicionals);
      console.log("file downloaded");
      return (true);
  }

  //Upload file PDF : http://localhost:3000/fact/filename
     @Get(':filename')
     downloadFile(@Param('filename') __filename, @Res() res): Observable<Object> {
         return of(res.sendFile(join(process.cwd(), 'downloads/', __filename)))
     }
  //Generate Pdf Facture
@Get(':idF/Pdf')
async generatePdf(@Param('idF')idF:number ,@Res() res :Response){
const client = await this.clientService.findClientByFactureId(idF);
 const facture=await this.factService.getOneById(idF)

        const fs = require("fs");
        const PDFDocument = require("pdfkit-table");
        const doc =new PDFDocument({ margin: 30, size: 'A4', });
        const textOptions = {font:'Times-Roman',fontSize: 12};

        doc.fontSize(12).font('Helvetica-Bold');
        doc.text( `Facture ${facture.numFact}`,10,20).moveDown();
        doc.text('Jax EXPEDTITONS:').text('').font('Helvetica');
        doc.text('Terrestre de marchandises').text('');
        doc.fontSize(10).font('Helvetica-Bold').text('Adresse: ', { continued:true}).font('Helvetica').text(' AV.taieb Mhiri-Le bardo');
        doc.font('Helvetica-Bold').text('MF: ', { continued:true}).font('Helvetica').text(' 1667460/l');
        doc.font('Helvetica-Bold').text('Tel: ', { continued:true}).font('Helvetica').text(' 31140170').moveDown();
       
        doc.text('',410,20).moveDown();
        doc.text('Information Client:').text('').font('Helvetica');
        doc.text(`Nom: ${client.nomCL}`).text('');
        doc.fontSize(10).font('Helvetica-Bold').text('MF: ', { continued:true}).font('Helvetica').text(`${client.mfCL}`);
        doc.font('Helvetica-Bold').text('Adresse: ', { continued:true}).font('Helvetica').text(`${client.adresseCL}`);


        doc.lineJoin('bevel').rect(20,120,150,120).fillAndStroke("#bfcce0", "#b4c2d6");
        doc.fillColor('black').text('Date de paiement',30,190)
        doc.text('N° de facture',30,130)
        .text('Date de fature',30,160)
        
        .text('échéance de paiement',30,220);
        doc.lineJoin('bevel').rect(170,120,150,120).stroke('#b4c2d6').moveDown().moveDown();
        doc.fillColor('black')
        doc.text(`${facture.numFact}`,212,130);
        doc.text(`${facture.dateFact}`,212,160);
        doc.text(`${facture.datePay}`,212,190);
        doc.text(`${facture.dateEch}`,212,220);

        doc.moveTo(20,150).lineTo(320,150).stroke();
        doc.moveTo(20,180).lineTo(320,180).stroke();
        doc.moveTo(20,210).lineTo(320,210).stroke();
  doc.y=300
  doc.x=20
// an SVG pat
  //  const table = {
  //    title: "",
  //    divider: {
  //      header: { disabled: false},
  //      horizontal: { disabled: false, width: 1, opacity: 1 },
  //      padding: 5,
  //      columnSpacing: 5,
  //    },
  //    headers: [
  //     { label: "Code",headerColor:"#b4c2d6", headerOpacity:1  },
  //     { label: "Désignation" ,headerColor:"#b4c2d6", headerOpacity:1},
  //     { label: "Quantité",headerColor:"#b4c2d6", headerOpacity:1 },
  //     { label: "Prix unitaire H.T",headerColor:"#b4c2d6", headerOpacity:1 },
  //     { label: "Montant H.T",headerColor:"#b4c2d6", headerOpacity:1 },
  //   ],
  //    rows: [
  //      [`${facture.code}`, `Colis livrés`,`${facture.QteColLiv}`, `${client.PColLiv}`,`${facture.MHTColLiv}`],
  //      [`${facture.code}`, `Retour colis`,`${facture.QteColRet}`, `${client.PColRet}`,`${facture.MHTColRet}`],
  //      [`${facture.code}`, `COD`,`${facture.QteCOD}`, `${client.Pcod}`,`${facture.MHTCOD}`],
  //      [`${facture.code}`, `Savebag MF`,`${facture.QteSBMF}`, `${client.Psbmf}`,`${facture.MHTSBMF}`],
  //      [`${facture.code}`, `Savebag GF`,`${facture.QteSBGF}`, `${client.Psbgf}`,`${facture.MTHTBGF}`]
  //   ],
  //  };
  //  doc.moveDown().table( table, { 
  //    // A4 595.28 x 841.89 (portrait) (about width sizes)
  //    width: 500,
  //     columnsSize: [ 100, 100, 100,100,100 ],
  //     prepareHeader: () => doc.fontSize(10)
  //     .fill('black'),
  //     prepareRow: (row, indexColumn, indexRow, rectRow) => {
  //       doc.font("Helvetica-Bold").fontSize(8);
  //       indexColumn === 0 && doc.addBackground(rectRow, '#b4c2d6', 0.15);
  //     },
  //  }); 

  doc.y=100
  doc.x=20
  
  doc.lineJoin('bevel').rect(20,260,550,30).fillAndStroke("#bfcce0", "#b4c2d6");
  doc.lineJoin('bevel').rect(20,260,110,270).stroke( "#b4c2d6");
  doc.lineJoin('bevel').rect(130,260,110,270).stroke( "#b4c2d6") ;
  doc.lineJoin('bevel').rect(240,260,110,270).stroke( "#b4c2d6");
  doc.lineJoin('bevel').rect(350,260,110,270).stroke( "#b4c2d6");
  doc.lineJoin('bevel').rect(460,260,110,270).stroke( "#b4c2d6");
  doc.moveTo(20,330).lineTo(570,330).stroke();
  doc.moveTo(20,370).lineTo(570,370).stroke();
  doc.moveTo(20,410).lineTo(570,410).stroke();
  doc.moveTo(20,450).lineTo(570,450).stroke();
    doc.moveTo(20,490).lineTo(570,490).stroke();
        doc.fillColor('black')
        doc.text('Code',45,270);
        doc.text('Désignation',150,270)
        doc.text('Quantité',255,270);
        doc.text('Prix unitaire H.T',360,270);
        doc.text('Monatant HT',465,270);

        //contenu
        doc.fillColor('black')
        doc.text(`1`,45,305);
        doc.text( `Colis livrés`,150,305)
        doc.text(`${facture.QteColLiv}`,255,305);
        doc.text(`${client.PColLiv}`,360,305);
        doc.text(`${facture.MHTColLiv}`,465,305);
        doc.fillColor('black')
        doc.text(`2`,45,345);
        doc.text(`Retour colis`,150,345)
        doc.text(`${facture.QteColRet}`,255,345);
        doc.text(`${client.PColRet}`,360,345);
        doc.text(`${facture.MHTColRet}`,465,345);

        doc.fillColor('black')
        doc.text(`3`,45,385);
        doc.text(`Colis echange`,150,385)
        doc.text(`${facture.QteColEchg}`,255,385);
        doc.text(`${client.PColEchg}`,360,385);
        doc.text(`${facture.MHTColEchg}`,465,385);
        doc.fillColor('black')
        doc.text(`4`,45,425);
        doc.text( `COD`,150,425)
        doc.text(`${facture.QteCOD}`,255,425);
          doc.text(`${client.Pcod}`,360,425);
        doc.text(`${facture.MHTCOD}`,465,425);

        doc.fillColor('black')
        doc.text(`5`,45,465);
        doc.text(`Savebag MF`,150,465)
        doc.text(`${facture.QteSBMF}`,255,465);
        doc.text(`${client.Psbmf}`,360,465);
        doc.text(`${facture.MHTSBMF}`,465,465);
           doc.fillColor('black')
        doc.text(`6`,45,505);
        doc.text( `Savebag GF`,150,505)
        doc.text(`${facture.QteSBGF}`,255,505);
          doc.text(`${client.Psbgf}`,360,505);
        doc.text(`${facture.MTHTBGF}`,465,505);
      
        doc.lineJoin('bevel').rect(270,550,150,204).fillAndStroke("#bfcce0", "#b4c2d6");
        doc.fillColor('black').text('Montant total H.T',280,568);
        doc.text('Total H.T',280,598);
        doc.text('Remise',280,635);
        doc.text('Total TVA',280,670);
        doc.text('Timbre Fiscal',280,705);
        doc.text('Monatant TTC',280,735);
      doc.lineJoin('bevel').rect(420,550,150,204).stroke('#b4c2d6');
        doc.fillColor('black')
        .text(`${facture.MTHT}`,430,568);
        doc.text(`${facture.TotHT}`,430,598);
        doc.text(`${facture.Remise}`,430,635);
        doc.text(`${facture.TotTVA}`,430,670);
        doc.text(`${facture.TimbreFSC}`,430,705);
        doc.text(`${facture.MontTTC}`,430,735);
        
       
        doc.moveTo(270,584).lineTo(570,584).stroke();
        doc.moveTo(270,618).lineTo(570,618).stroke();
        doc.moveTo(270,652).lineTo(570,652).stroke();
        doc.moveTo(270,686).lineTo(570,686).stroke();
        doc.moveTo(270,720).lineTo(570,720).stroke();
        doc.moveTo(270,754).lineTo(570,754).stroke();
        
        
doc.fillColor('black').text('',20,740);
doc.text('Nos coordonnées bancaires');
doc.text('Banque :');
doc.text('Domiciliation :');
doc.text('Numéro de compte :');
      


const date = new Date();
const year = date.getFullYear();
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const day = date.getDate().toString().padStart(2, '0');
const hours = date.getHours().toString().padStart(2, '0');
const minutes = date.getMinutes().toString().padStart(2, '0');





const formattedDateTime = `${year}-${month}-${day}_${hours}-${minutes}`;
 // Format date as 'YYYY-MM-DD'

// Set headers for PDF download
const dirPath = path.resolve(process.cwd(), 'facturePdf');
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
  doc.pipe(fs.createWriteStream(filePathlocal, { mode: 0o644 }))
    .on('finish', () => {
      console.log('File writing finished');
      // Now, copy the file to the second directory
      fs.copyFile(filePathlocal, filePathserver, { mode: 0o644 }, (err) => {
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

  doc.end();
});

console.log(`File path: ${filePathlocal }`);

    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', `attachment; filename=${formattedDateTime}`);
    // res.download(filePath);
    // res.json(bl.id);
    res.sendFile(filePathlocal);


    //  await this.savePDF(filePathlocal, res, formattedDateTime);
    return filePathlocal
    } catch (error) {
    console.error(error);
    
}
}
