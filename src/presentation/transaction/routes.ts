import { Router } from 'express';
import { TransactionController } from './controller';
import { CreateTransactionService } from './services/create-transaction.service';
import { AuthMiddleware } from '../common/middlewares/auth.middlewares';
import { DataSource } from 'typeorm';
import { FinderTransactionService } from './services/finder-transaction.service';

export class TransactionRoutes {
  static getRoutes(datasource: DataSource): Router {
    const router = Router();

    const createTransactionService = new CreateTransactionService(datasource);
    const finderTransactionService = new FinderTransactionService(datasource);
    const controller = new TransactionController(
      createTransactionService,
      finderTransactionService
    );

    router.post('/transactions', controller.create);
    router.get('/transactions', controller.getTransactions);
    router.get('/transactions/:id', controller.getTransactionById);

    return router;
  }
}
