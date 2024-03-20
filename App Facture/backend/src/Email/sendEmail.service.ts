import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chouaibiaymen03@gmail.com',
        pass: 'ypbupptdzxibojzz', 
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: 'your-email@gmail.com', 
      to, 
      subject, 
      text, 
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendEmailWithAttachment(to: string, subject: string, text: string, filePath: string) {
    try {
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        throw new Error('File not found');
      }
  
      const mailOptions = {
        from: 'your-email@example.com',
        to: to,
        subject: subject,
        text: text,
        attachments: [
          {
            filename: 'offre.pdf',
            path: filePath,
            encoding: 'base64', 
          },
        ],
      };
  
      await this.transporter.sendMail(mailOptions);
  
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
  
}
