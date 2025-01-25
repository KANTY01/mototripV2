import { UserInstance } from '../models/user';

declare global {
  namespace Express {
    interface Request {
      user?: UserInstance;
    }
  }
}
