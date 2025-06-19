import { encriptAdapter } from '../../../config/bcrypt.adapter';
import { User } from '../../../data';
import { CustomError, RegisterUserDto } from '../../../domain';
import { generateAccountNumber } from '../../../utils/account.service';

export class CreatorUserService {
  async execute(data: RegisterUserDto) {
    const user = new User();

    user.name = data.name.trim().toLowerCase();
    user.email = data.email.trim().toLowerCase();
    user.password = encriptAdapter.hash(data.password.trim());
    user.account_number = generateAccountNumber();
    user.balance = 0;
    try {
      await user.save();
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
      CustomError.internalServer('internal server error');
    }
  }
}
