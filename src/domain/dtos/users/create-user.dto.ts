import { regularExp } from '../../../config/reggex';

export class RegisterUserDto {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  static execute(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;

    if (!name) return ['Name is required!'];
    if (!email) return ['Email is required'];
    if (!regularExp.email.test(email)) return ['Email is invalid'];
    if (!password) return ['Password is required'];
    if (!regularExp.password.test(password))
      return ['Format password is invalid'];

    return [
      undefined,
      new RegisterUserDto(
        name.trim().toLowerCase(),
        email.trim().toLowerCase(),
        password.trim()
      ),
    ];
  }
}
