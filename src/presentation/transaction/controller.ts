import { Request, Response } from 'express';
import { CreateTransactionService } from './services/create-transaction.service';
import { handleError } from '../common/errors/handleError';
import { CreateTransactionDto } from '../../domain/dtos/transactions/create-transaction.dto';
import { FinderTransactionService } from './services/finder-transaction.service';

export class TransactionController {
  constructor(
    private readonly createTransactionService: CreateTransactionService,
    private readonly finderTransactionService: FinderTransactionService
  ) {}

  create = (req: Request, res: Response) => {
    const [error, createTransactionDto] = CreateTransactionDto.create(req.body);

    if (error) {
      return res.status(422).json({ message: error });
    }
    const senderId = req.body.sessionUser.id;

    this.createTransactionService
      .execute(createTransactionDto!, senderId)
      .then((data) => res.status(201).json(data))
      .catch((error) => handleError(error, res));
  };

  getTransactions = (req: Request, res: Response) => {
    const { id: userId } = req.body.sessionUser;

    this.finderTransactionService
      .findAllByUserId(userId)
      .then((transactions) => res.json(transactions))
      .catch((error) => handleError(error, res));
  };

  getTransactionById = (req: Request, res: Response) => {
    const { id: userId } = req.body.sessionUser;
    const { id: transactionId } = req.params;

    this.finderTransactionService
      .findOneById(transactionId, userId)
      .then((transaction) => res.json(transaction))
      .catch((error) => handleError(error, res));
  };
}
