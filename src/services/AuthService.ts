import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserInput, LoginInput } from '../models/interfaces';
import UserRepository from '../repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = UserRepository.getInstance();
  }

  async register(userInput: UserInput): Promise<{ user: User; token: string }> {
    const email = userInput.email.toLowerCase();
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('The user already exists');
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 10);

    const user: User = {
      id: uuidv4(),
      email: email,
      password: hashedPassword,
      name: userInput.name.toLowerCase()
    };

    const savedUser = this.userRepository.save(user);

    const token = this.generateToken(savedUser);

    return { user: savedUser, token };
  }

  async login(loginInput: LoginInput): Promise<{ user: User; token: string }> {
    const email = loginInput.email.toLowerCase();
    
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { 
        userId: user.id,
        email: user.email.toLowerCase()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
} 