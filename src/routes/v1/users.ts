import { Router } from 'express';

import { addUser, getUsers, getUserDetails, updateUser, deleteUser } from 'controllers/users';
import { checkJwt } from 'middleware/checkJwt';
import { validatorAdd } from 'middleware/validation/users';

const router = Router();

router.get('/', [checkJwt], getUsers);

router.get('/:id([0-9]+)', [checkJwt], getUserDetails);

router.post('/', [checkJwt], addUser);

router.patch('/:id([0-9]+)', [checkJwt, validatorAdd], updateUser);

router.delete('/:id([0-9]+)', [checkJwt], deleteUser);

export default router;
