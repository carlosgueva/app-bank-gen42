export class CreateTransactionDto {
  private constructor(
    public readonly receiverAccountNumber: string,
    public readonly amount: number
  ) {}

  static create(props: {
    [key: string]: any;
  }): [string?, CreateTransactionDto?] {
    const { receiverAccountNumber, amount } = props;

    if (receiverAccountNumber === undefined || amount === undefined) {
      return [
        'The recipient account number and amount are required',
        undefined,
      ];
    }

    if (typeof amount !== 'number' || isNaN(amount)) {
      return ['The amount must be a numeric value', undefined];
    }

    if (amount <= 0) {
      return ['The transfer amount must be greater than zero', undefined];
    }

    if (
      typeof receiverAccountNumber !== 'string' ||
      receiverAccountNumber.trim().length === 0
    ) {
      return ['The recipient account number is not valid', undefined];
    }

    return [
      undefined,
      new CreateTransactionDto(receiverAccountNumber, Number(amount)),
    ];
  }
}
