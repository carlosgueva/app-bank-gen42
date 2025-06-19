import { DataSource } from 'typeorm';
import { Transaction, User } from '../../../data';
import { CustomError } from '../../../domain';

export class FinderTransactionService {
  constructor(private readonly datasource: DataSource) {}

  async findAllByUserId(userId: string) {
    const transactionRepository = this.datasource.getRepository(Transaction);

    const transactions = await transactionRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver'],
      order: {
        transaction_date: 'DESC',
      },
    });

    return transactions.map((tx) => ({
      id: tx.id,
      amount: tx.amount,
      transaction_date: tx.transaction_date,
      sender: {
        id: tx.sender.id,
        name: tx.sender.name,
        account_number: tx.sender.account_number,
      },
      receiver: {
        id: tx.receiver.id,
        name: tx.receiver.name,
        account_number: tx.receiver.account_number,
      },
    }));
  }

  async findOneById(transactionId: string, userId: string) {
    const transactionRepository = this.datasource.getRepository(Transaction);
    const transaction = await transactionRepository.findOne({
      where: [
        { id: transactionId, sender: { id: userId } },
        { id: transactionId, receiver: { id: userId } },
      ],
      relations: ['sender', 'receiver'],
    });

    if (!transaction) {
      throw CustomError.notFound(
        `Transaction with id ${transactionId} not found`
      );
    }

    return {
      id: transaction.id,
      amount: transaction.amount,
      transaction_date: transaction.transaction_date,
      sender: {
        name: transaction.sender.name,
        account_number: transaction.sender.account_number,
      },
      receiver: {
        name: transaction.receiver.name,
        account_number: transaction.receiver.account_number,
      },
    };
  }
}
