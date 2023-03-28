import { Request, Response, NextFunction } from 'express';

export const validatorAdd = async (req: Request, res: Response, next: NextFunction) => {
  return next();
};
