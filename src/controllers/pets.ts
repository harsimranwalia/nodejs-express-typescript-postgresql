import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Pet } from 'orm/entities/Pet';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const getPets = async (req: Request, res: Response, next: NextFunction) => {
  const petRepository = getRepository(Pet);
  try {
    const pets = await petRepository.find({
      select: ['id', 'name', 'breed', 'age', 'created_at', 'updated_at'],
    });
    res.customSuccess(200, 'List of pets.', pets);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of pets.`, null, err);
    return next(customError);
  }
};

export const getPetDetail = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const petRepository = getRepository(Pet);
  try {
    const pet = await petRepository.findOne(id, {
      select: ['id', 'name', 'breed', 'age', 'created_at', 'updated_at'],
    });

    if (!pet) {
      const customError = new CustomError(404, 'General', `Pet with id:${id} not found.`, ['Pet not found.']);
      return next(customError);
    }
    res.customSuccess(200, 'Pet found', pet);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};

export const addPet = async (req: Request, res: Response, next: NextFunction) => {
  const pet = req.body;

  const petRepository = getRepository(Pet);
  try {
    await petRepository.save(pet);
    res.customSuccess(200, 'Pet successfully saved.');
  } catch (err) {
    const customError = new CustomError(409, 'Raw', `Pet '${pet.name}' can't be saved.`, null, err);
    return next(customError);
  }
};

export const updatePet = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name, breed, age } = req.body;

  const petRepository = getRepository(Pet);
  try {
    const pet = await petRepository.findOne({ where: { id } });

    if (!pet) {
      const customError = new CustomError(404, 'General', `Pet with id:${id} not found.`, ['Pet not found.']);
      return next(customError);
    }

    if (name) pet.name = name;
    if (age) pet.age = age;
    if (breed) pet.breed = breed;

    try {
      await petRepository.save(pet);
      res.customSuccess(200, 'Pet successfully saved.');
    } catch (err) {
      const customError = new CustomError(409, 'Raw', `Pet '${pet.id}' can't be saved.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};

export const deletePet = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const petRepository = getRepository(Pet);
  try {
    const pet = await petRepository.findOne({ where: { id } });

    if (!pet) {
      const customError = new CustomError(404, 'General', 'Not Found', [`Pet with id:${id} doesn't exists.`]);
      return next(customError);
    }
    petRepository.delete(id);

    res.customSuccess(200, 'Pet successfully deleted.', { id: pet.id, name: pet.name, age: pet.age });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
