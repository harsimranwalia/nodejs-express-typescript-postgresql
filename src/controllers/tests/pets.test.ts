import 'mocha';
import 'dotenv/config';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { dbCreateConnection } from 'orm/dbCreateConnection';
import { Pet } from 'orm/entities/Pet';
import { User } from 'orm/entities/User';

import { app } from '../..';

describe('Pets', () => {
  let dbConnection: Connection;
  let petRepository: Repository<Pet>;
  let userRepository: Repository<User>;

  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkJydWNlIFdheW5lIiwiZW1haWwiOiJicnVjZUB3YXluZS5jb20iLCJjcmVhdGVkX2F0IjoiMjAyMC0wNi0xM1QwODoyNjoxNS41MjZaIiwiaWF0IjoxNTkyMTYxMjcwLCJleHAiOjE2ODIxNjIxNzB9.M0U29Q10G14iO3bHVgCaXE9vfHZuSQ0k5G9mzANTLVE';

  const user = new User();
  user.email = 'bruce@wayne.com';

  const pet = new Pet();
  pet.name = 'Bagheera';
  pet.breed = 'German Shepherd';
  pet.age = 2;

  before(async () => {
    dbConnection = await dbCreateConnection();
    petRepository = getRepository(Pet);
    userRepository = getRepository(User);
  });

  beforeEach(async () => {
    const dbUser = await userRepository.save([user]);
    user.id = dbUser[0].id;
    pet.user_id = user.id;
    await petRepository.save([pet]);
  });

  afterEach(async () => {
    await petRepository.delete([pet.id]);
    await userRepository.delete([user.id]);
  });

  describe('GET /v1/pets', () => {
    it('should get all pets', async () => {
      const res = await request(app).get('/v1/pets').set('Authorization', token);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('List of pets.');
    });

    it('should update pet name', async () => {
      const res = await request(app).patch(`/v1/pets/${pet.id}`).set('Authorization', token).send({name: 'lucy'});
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Pet successfully saved.');
    });
  });
});
