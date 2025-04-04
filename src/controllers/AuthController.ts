import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { UserInput, LoginInput } from '../models/interfaces';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userInput: UserInput = req.body;
      const result = await this.authService.register(userInput);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginInput: LoginInput = req.body;
      const result = await this.authService.login(loginInput);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
} 