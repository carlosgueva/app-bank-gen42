import { Router } from 'express';
import { UserRoutes } from './user/routes';
import { TransactionRoutes } from './transaction/routes';
import { DataSource } from 'typeorm';

export class AppRoutes {
  static getRoutes(datasource: DataSource): Router {
    const router = Router();

    router.use('/api', UserRoutes.routes);
    router.use('/api', TransactionRoutes.getRoutes(datasource));

    return router;
  }
}
