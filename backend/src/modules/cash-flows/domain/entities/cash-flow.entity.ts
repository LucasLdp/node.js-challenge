export class CashFlow {
  constructor(
    public props: {
      userId: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      description: string | null;
      id?: string;
    },
  ) {}

  get id(): string | undefined {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get type(): 'INCOME' | 'EXPENSE' {
    return this.props.type;
  }

  get description(): string | null {
    return this.props.description;
  }
}
