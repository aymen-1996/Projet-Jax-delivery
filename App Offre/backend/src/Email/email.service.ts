import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { readFile } from 'xlsx';
import {join } from 'path';
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

  async sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject,
        html: htmlContent, // Use the 'html' property for HTML content
    };

    await this.transporter.sendMail(mailOptions);
}
async sendEmailWithAttachment(to: string, subject: string, text: string, filePath: string) {
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      // Handle the error or throw an exception
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
          encoding: 'base64', // adjust encoding if needed
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


