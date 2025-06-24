import { Request, Response } from 'express';
import { CreatorUserService } from './services/creator-user.service';
import { LoginUserService } from './services/login-user.service';
import { InfoUserService } from './services/info-user.service';
import { handleError } from '../common/errors/handleError';
import { LoginUserDto, RegisterUserDto } from '../../domain';
import { envs } from '../../config/env';

export class UserController {
  constructor(
    private readonly creatorUserService: CreatorUserService,
    private readonly loginUserService: LoginUserService,
    private readonly infoUserService: InfoUserService
  ) {}

  register = (req: Request, res: Response) => {
    const [error, data] = RegisterUserDto.execute(req.body);

    if (error) {
      return res.status(422).json({ message: error });
    }

    this.creatorUserService
      .execute(data!)
      .then((user) => res.status(201).json(user))
      .catch((error) => handleError(error, res));
  };

  login = (req: Request, res: Response) => {
    const [error, data] = LoginUserDto.execute(req.body);

    if (error) {
      return res.status(422).json({ message: error });
    }

    this.loginUserService
      .execute(data!)
      .then((data) => {
        res.cookie('token', data.token, {
          httpOnly: true,
          secure: envs.NODE_ENV === ' production',
          sameSite: 'strict',
          maxAge: 3 * 60 * 60 * 1000,
        });
        res.status(200).json(data);
      })
      .catch((error) => handleError(error, res));
  };

  info = (req: Request, res: Response) => {
    this.infoUserService
      .executeInfoUser(req.body.sessionUser)
      .then((data) => res.status(200).json(data))
      .catch((error) => handleError(error, res));
  };

  validateAccount = (req: Request, res: Response) => {
    const { token } = req.params;

    this.creatorUserService
      .validateAcoount(token)
      .then((data) => res.status(200).json(data))
      .catch((error) => handleError(error, res));
  };
}
