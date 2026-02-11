export class User {
  constructor(
    public props: {
      name: string;
      email: string;
      password: string;
      role?: string;
      id?: string;
    },
  ) {}

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get role(): string | undefined {
    return this.props.role;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set email(email: string) {
    this.props.email = email;
  }

  set password(password: string) {
    this.props.password = password;
  }

  set role(role: string | undefined) {
    this.props.role = role;
  }
}
