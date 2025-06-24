import { Router } from 'express';
import { UserController } from './controller';
import { CreatorUserService } from './services/creator-user.service';
import { LoginUserService } from './services/login-user.service';
import { InfoUserService } from './services/info-user.service';
import { AuthMiddleware } from '../common/middlewares/auth.middlewares';
import { EmailService } from '../common/services/email.service';
import { envs } from '../../config/env';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const emailservice = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_MAIL
    );

    const infoUserService = new InfoUserService();
    const loginUserService = new LoginUserService();
    const creatorUserService = new CreatorUserService(emailservice);
    const controller = new UserController(
      creatorUserService,
      loginUserService,
      infoUserService
    );

    router.post('/auth/register', controller.register);
    router.post('/auth/login', controller.login);
    router.get('/users/validate-account/:token', controller.validateAccount);
    router.use(AuthMiddleware.protect);
    router.get('/users/me', controller.info);

    return router;
  }
}
