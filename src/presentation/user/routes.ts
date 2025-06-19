import { Router } from 'express';
import { UserController } from './controller';
import { CreatorUserService } from './services/creator-user.service';
import { LoginUserService } from './services/login-user.service';
import { InfoUserService } from './services/info-user.service';
import { AuthMiddleware } from '../common/middlewares/auth.middlewares';

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const infoUserService = new InfoUserService();
    const loginUserService = new LoginUserService();
    const creatorUserService = new CreatorUserService();
    const controller = new UserController(
      creatorUserService,
      loginUserService,
      infoUserService
    );

    router.post('/auth/register', controller.register);
    router.post('/auth/login', controller.login);
    router.use(AuthMiddleware.protect);
    router.get('/users/me', controller.info);

    return router;
  }
}
