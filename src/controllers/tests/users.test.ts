import 'mocha';
import 'dotenv/config';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { dbCreateConnection } from 'orm/dbCreateConnection';
import { User } from 'orm/entities/User';

import { app } from '../..';

describe('Users', () => {
  let dbConnection: Connection;
  let userRepository: Repository<User>;

  const userPassword = 'pass1';
  let userToken = null;
  const user = new User();
  user.name = 'Bruce Wayne';
  user.email = 'bruce@wayne.com';
  user.password = userPassword;
  user.hashPassword();

  before(async () => {
    dbConnection = await dbCreateConnection();
    userRepository = getRepository(User);
  });

  beforeEach(async () => {
    await userRepository.save([user]);
    const res = await request(app).post('/v1/auth/login').send({ email: user.email, password: userPassword });
    userToken = res.body.data;
  });

  afterEach(async () => {
    await userRepository.delete([user.id]);
  });

  describe('GET /v1/auth/users', () => {
    it('should get all users', async () => {
      const res = await request(app).get('/v1/users').set('Authorization', userToken);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('List of users.');
    });
  });

  describe('GET /v1/auth/users//:id([0-9]+)', () => {
    it('should get user', async () => {
      const dbUser = await userRepository.findOne({ email: user.email });
      const res = await request(app).get(`/v1/users/${dbUser.id}`).set('Authorization', userToken);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('User found');
      expect(res.body.data.email).to.eql(dbUser.email);
    });
  });
});
