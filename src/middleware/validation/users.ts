import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from 'orm/entities/User';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorAdd = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const errorsValidation: ErrorValidation[] = [];
  const userRepository = getRepository(User);

  if (!email) {
    errorsValidation.push({ email: `Email '${email}' is not passed but is mandatory` });
  }

  const user = await userRepository.findOne({ email });
  if (user) {
    errorsValidation.push({ email: `Email '${email}' already exists` });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Edit user validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
