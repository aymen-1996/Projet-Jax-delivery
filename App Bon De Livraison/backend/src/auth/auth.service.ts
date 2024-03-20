import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { EmailService } from 'src/Email/email.service';
import { parse } from 'uuid';
import * as uuid from 'uuid';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  getHello(): string {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,

  ) {
  }
  uuidv4ToInt(uuidValue) {
    // Remove dashes and convert to lowercase
    //const hexString = uuidValue.replace(/-/g, '').toLowerCase();
  
    // Use parseInt with base 16 to convert hex to decimal
    //const uuidAsInt = parseInt(hexString, 16);
    const parsedUuid = parse(uuidValue);
    const numericValue = parseInt(crypto.createHash('md5').update(parsedUuid).digest('hex'), 16);

    return numericValue;
  }



generateRandomNumber(min: number, max: number): number {
    // Generate a random number between min (inclusive) and max (exclusive)
    return Math.floor(Math.random() * (max - min) + min);
  }
  
  ref = (this.generateRandomNumber(1, 100)).toString();
  
  generateUniqueId(): number {
    // Get the current timestamp
    const timestamp = new Date().getTime();
  
    // Generate a random number (you may want to use a more sophisticated random number generator)
    const random = Math.floor(Math.random() * 1000);
  
    // Combine timestamp and random number to create a unique ID
    const uniqueId = parseInt(`${timestamp}${random}`, 10);
  
    return uniqueId;
  }


  async create(data: any): Promise<{ user?: User; message?: string }> {
    const idd=uuidv4()
    const existingUser=await this.findOne(data.email);
     if (existingUser) {
    // If the email already exists, throw an exception or return an error message
    return { message: 'Email already exists. Please choose a different email.' };
  }else{
  const newUser = await this.userRepository.save({
    id: this.generateUniqueId(),
    ...data
  });

  // Return the created user along with a success message
  return { user: newUser, message: 'User created successfully.' };
  }
  }

  // improve error handling 

  // improve error handling 
  async findOne(email: string): Promise<User | undefined> {
    try {
      const user = this.userRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      return undefined;
    }
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  //update logo user
  async updateLogo(userId: number, newLogoFileName: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    user.logo = newLogoFileName;
    return this.userRepository.save(user);
  }

  //Récupère l'utilisateur depuis le référentiel en utilisant le userId pour creer restcode

  async storeResetCode(userId: number, resetCode: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    user.resetCode = resetCode;

    await this.userRepository.save(user);
  }


  async getResetCode(userId: number): Promise<{ code: number } | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    return user.resetCode ? { code: user.resetCode } : null;
  }


  async updatePassword(userId: number, newPassword: string): Promise<void> {

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    user.password = newPassword;

    await this.userRepository.save(user);
  }


  //Récupère l'utilisateur depuis email et puis envoyer  restecode  à  leur email
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000);

    await this.storeResetCode(user.id, resetCode);


    this.emailService.sendEmail(
      user.email,
      'Password Reset Code',
      `Your password reset code is: ${resetCode}`,
    );
  }


  //change password par restecode envoyer par mail si password changer reste code devient invalide
  async resetPassword(email: string, resetCode: number, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const storedResetCode = await this.getResetCode(user.id);

    if (!storedResetCode || storedResetCode.code !== resetCode) {
      throw new Error('Invalid reset code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.updatePassword(user.id, hashedPassword);

    await this.clearResetCode(user.id);
  }


  async clearResetCode(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    user.resetCode = null;

    await this.userRepository.save(user);
  }

}
