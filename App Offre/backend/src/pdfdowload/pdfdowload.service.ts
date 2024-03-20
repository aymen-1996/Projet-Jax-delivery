import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as PDFDocument from 'pdfkit';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';

//const PDFDocument = require('pdfkit-table')
@Injectable()
export class PdfdownloadService {

    constructor(
    private readonly authService: AuthService){}


    async generatePDF(): Promise<Buffer>
     {
        const pdfBuffer: Buffer = await new Promise(resolve => {
          const doc = new PDFDocument({
            size: 'LETTER',
            bufferPages: true,
          })

// customize your PDF document
doc.text('PDF DOC', 100, 50);
doc.moveDown();

const buffer = []
doc.on('data', buffer.push.bind(buffer))
doc.on('end', () => {
  const data = Buffer.concat(buffer)
  resolve(data)
})
doc.end()
})
return pdfBuffer;

}





}