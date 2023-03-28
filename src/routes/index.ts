import { Router } from 'express';

import route404 from './general/404';
import root from './general/root';
import v1 from './v1/';

const router = Router();

router.use(`/v1`, v1);

router.use(root);
router.use(route404);

export default router;
