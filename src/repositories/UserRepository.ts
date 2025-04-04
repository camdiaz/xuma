import { User, UserInput } from '../models/interfaces';

export interface IUserRepository {
  save(user: User): User;
  findByEmail(email: string): User | null;
  findById(id: string): User | null;
}

class UserRepository implements IUserRepository {
  private static instance: UserRepository;
  private users: Map<string, User>;

  private constructor() {
    this.users = new Map<string, User>();
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  save(user: User): User {
    const userToSave = {
      ...user,
      email: user.email.toLowerCase(),
      name: user.name.toLowerCase()
    };
    this.users.set(userToSave.id, userToSave);
    return userToSave;
  }

  findByEmail(email: string): User | null {
    const searchEmail = email.toLowerCase();
    return Array.from(this.users.values()).find(user => user.email === searchEmail) || null;
  }

  findById(id: string): User | null {
    return this.users.get(id) || null;
  }
}

export default UserRepository; 