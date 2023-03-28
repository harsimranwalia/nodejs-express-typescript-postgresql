import { Router } from 'express';

import auth from './auth';
import pets from './pets';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/pets', pets);

export default router;
