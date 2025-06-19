import { DataSource } from 'typeorm';
import { envs } from '../../../config/env';
import { Transaction, User } from '../../../data';
import { CustomError } from '../../../domain';
import { CreateTransactionDto } from '../../../domain/dtos/transactions/create-transaction.dto';

export class CreateTransactionService {
  constructor(private readonly datasource: DataSource) {}

  async execute(createTransactionDto: CreateTransactionDto, senderId: string) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { receiverAccountNumber, amount } = createTransactionDto;

    try {
      const userRepository = queryRunner.manager.getRepository(User);
      const transactionRepository =
        queryRunner.manager.getRepository(Transaction);

      const sender = await userRepository.findOneBy({ id: senderId });
      const receiver = await userRepository.findOneBy({
        account_number: receiverAccountNumber,
      });

      if (!sender) {
        throw CustomError.notFound('The issuing user does not exist');
      }
      if (!receiver) {
        throw CustomError.notFound('The recipient account was not found');
      }
      if (sender.id === receiver.id) {
        throw CustomError.badRequest(
          'You cannot make a transfer to your own account'
        );
      }
      if (sender.balance < amount) {
        throw CustomError.badRequest(
          'Insufficient balance to make the transfer'
        );
      }

      sender.balance = Number(sender.balance) - amount;
      receiver.balance = Number(receiver.balance) + amount;

      await userRepository.save(sender);
      await userRepository.save(receiver);

      const transaction = transactionRepository.create({
        sender: sender,
        receiver: receiver,
        amount: amount,
      });
      await transactionRepository.save(transaction);

      await queryRunner.commitTransaction();

      return {
        message: 'Transfer completed successfully',
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          receiverAccount: receiver.account_number,
          timestamp: transaction.transaction_date,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof CustomError) {
        throw error;
      }
      console.error(error);
      throw CustomError.internalServer(
        'Something went wrong during the transfer'
      );
    } finally {
      await queryRunner.release();
    }
  }
}
