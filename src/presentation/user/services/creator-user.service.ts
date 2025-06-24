import { encriptAdapter } from '../../../config/bcrypt.adapter';
import { JwtAdapter } from '../../../config/jwt.adapter';
import { User } from '../../../data';
import { CustomError, RegisterUserDto } from '../../../domain';
import { generateAccountNumber } from '../../../utils/account.service';
import { EmailService } from '../../common/services/email.service';
import pug from 'pug';
import path from 'path';

export class CreatorUserService {
  constructor(private readonly emailservice: EmailService) {}

  async execute(data: RegisterUserDto) {
    const user = new User();

    user.name = data.name.trim().toLowerCase();
    user.email = data.email.trim().toLowerCase();
    user.password = encriptAdapter.hash(data.password.trim());
    user.account_number = generateAccountNumber();
    user.balance = 0;
    try {
      await user.save();
      this.sendLinkToEmailFromValidationAccount(user.email, user.name);
      return {
        user: {
          name: user.name,
          email: user.email,
          account_number: user.account_number,
          balance: user.balance,
          id: user.id,
        },
      };
    } catch (error) {
      throw CustomError.internalServer('internal server error');
    }
  }

  private sendLinkToEmailFromValidationAccount = async (
    email: string,
    name: string
  ) => {
    const token = await JwtAdapter.generateToken({ email }, '300s');
    if (!token) throw CustomError.internalServer('Error getting token');

    const link = `http://localhost:3000/api/users/validate-account/${token}`;
    const templatePath = path.resolve(
      process.cwd(),
      'src/presentation/templates/email/validate-account.pug'
    );
    const html = pug.renderFile(templatePath, {
      name: name,
      activationLink: link,
    });

    const isSent = await this.emailservice.sendEmail({
      to: email,
      subject: 'Validate your account',
      htmlBody: html,
    });
    if (!isSent) throw CustomError.internalServer('Error sending email');
    return true;
  };

  public validateAcoount = async (token: string) => {
    const payload = await this.validateToken(token);

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer('Email not found in token');

    const user = await this.enuseUserExistwithEmail(email);

    user.status = true;

    try {
      await user.save();
      return 'User activated';
    } catch (error) {
      throw CustomError.internalServer('Something went very wrong');
    }
  };

  private async enuseUserExistwithEmail(email: string) {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw CustomError.internalServer('Email not registered in db');
    }
    return user;
  }

  private async validateToken(token: string) {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.badRequest('Invalid token');
    return payload;
  }
}
