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
import { ICustomPaginationOptions } from 'src/offre/DTO/ICustomPaginationOptions';
import { IPaginationMeta, IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

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


  async create(data: any): Promise<User> {
    const userData = {
      ...data,
      role: 'user',
      active:true
    };
  
    return this.userRepository.save(userData);
  }

  // improve error handling 
  async findOne(email: string): Promise<User | undefined> {
    try {
      const user = this.userRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      return undefined;
    }
  }

  async getAllUserByEmail(
    options: IPaginationOptions,
    email: string,
    active: string,
  ): Promise<Pagination<User, IPaginationMeta>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
  
    if (email) {
      queryBuilder.andWhere('user.email = :email', { email });
    }
  
    if (active) {
      queryBuilder.andWhere('user.active = :active', { active });
    }
  
    queryBuilder.andWhere('user.role = :role', { role: 'user' });
  
    const paginationResult = await paginate<User, IPaginationMeta>(
      queryBuilder,
      options,
    );
    return paginationResult;
  }
  
  
  
  async isUserActive(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    return user.active;
  }
  
  async updateActive(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({  id });

    if (user) {
      user.active = !user.active;
      return this.userRepository.save(user);
    }

    return undefined;
  }
  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  //update logo user
 /* async updateLogo(userId: number, newLogoFileName: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    user.logo = newLogoFileName;
    return this.userRepository.save(user);
  }*/

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

// Récupère l'utilisateur depuis email et puis envoyer reset code à leur email
async requestPasswordReset(email: string): Promise<void> {
  const user = await this.userRepository.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000);

  await this.storeResetCode(user.id, resetCode);

  const htmlContent = `
  <html>
  <body>
    <div style="max-width: 600px; height: 200px; padding: 20px; margin: 0 auto; background: url('https://cdn-icons-png.flaticon.com/512/807/807241.png') no-repeat center center ; border-radius: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); text-align: center;">
      <h2 style="color: #0066cc;">Password Reset Code</h2>
      <p  color: black;">Your password reset code is: <strong style="color: blue;">${resetCode}</strong></p>
    </div>
  </body>
</html>


`;

 this.emailService.sendEmail(user.email, 'Password Reset Code', htmlContent);


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

    try {
        const admins = await this.userRepository.find({ where: { role: 'admin' } });

        const adminEmails = admins.map((admin) => admin.email);

        await Promise.all(
            adminEmails.map(async (adminEmail) => {
                 this.emailService.sendEmail(
                    adminEmail,
                    'Password Reset Notification',
                    `User ${user.email} has reset their password. \n The new password is: ${newPassword}`,                    
                );
            })
        );
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
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