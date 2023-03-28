import { Router } from 'express';

import { addPet, getPets, getPetDetail, updatePet, deletePet } from 'controllers/pets';
import { checkJwt } from 'middleware/checkJwt';
import { validatorAdd } from 'middleware/validation/pets';

const router = Router();

router.get('/', [checkJwt], getPets);

router.get('/:id([0-9]+)', [checkJwt], getPetDetail);

router.post('/', [checkJwt, validatorAdd], addPet);

router.patch('/:id([0-9]+)', [checkJwt, validatorAdd], updatePet);

router.delete('/:id([0-9]+)', [checkJwt], deletePet);

export default router;
