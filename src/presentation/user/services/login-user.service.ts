import { encriptAdapter } from '../../../config/bcrypt.adapter';
import { JwtAdapter } from '../../../config/jwt.adapter';
import { User } from '../../../data';
import { CustomError, LoginUserDto } from '../../../domain';
import { envs } from '../../../config/env';

export class LoginUserService {
  async execute(data: LoginUserDto) {
    const user = await this.ensureUserExist(data.email);

    this.ensurePasswordIsCorrect(data.password, user.password);

    const token = await this.generateToken(
      { id: user!.id },
      envs.JWT_EXPIRE_IN
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  private async ensureUserExist(email: string) {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw CustomError.notFound('User not found');
    }

    return user;
  }

  private ensurePasswordIsCorrect(
    unHashedPassword: string,
    hashedPassword: string
  ) {
    const isMatch = encriptAdapter.compare(unHashedPassword, hashedPassword);

    if (!isMatch) {
      throw CustomError.unAuthorized('invalid credentials');
    }
  }

  private async generateToken(payload: any, duration: string) {
    const token = await JwtAdapter.generateToken(payload, duration);
    if (!token) throw CustomError.internalServer('Error while creating jwt');
    return token;
  }
}
