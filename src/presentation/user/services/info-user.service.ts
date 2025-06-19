import { User } from '../../../data';

export class InfoUserService {
  async executeInfoUser(sessionUser: User) {
    const UserInfo = {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      account_number: sessionUser.account_number,
      balance: sessionUser.balance,
      created_at: sessionUser.created_at,
    };

    return UserInfo;
  }
}
