import { Request, Response, NextFunction } from 'express';
import User from '../models/user.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const roleCheck = (allowedRoles: User['role'][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User|undefined;
    
    if (!user?.role || !allowedRoles.includes(user.role)) {
      return ApiResponse.sendError(res, 'Insufficient privileges', 403);
    }
    
    next();
  };
};
