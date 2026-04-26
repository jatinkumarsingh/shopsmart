const request = require('supertest');
const app = require('../../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Auth Integration Tests (API + DB)', () => {
  const testUser = {
    email: 'int_test@example.com',
    password: 'password123',
    name: 'Integration Test User',
  };

  beforeAll(async () => {
    // Clean up test database before all tests
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    // Clean up after tests and disconnect
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user in the database', async () => {
      const res = await request(app).post('/api/auth/signup').send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);

      // Verify database record
      const dbUser = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(dbUser).not.toBeNull();
      expect(dbUser.name).toEqual(testUser.name);
    });

    it('should fail to register the same email twice', async () => {
      const res = await request(app).post('/api/auth/signup').send(testUser);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with the newly created user', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toEqual(testUser.email);
    });

    it('should fail with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });

      expect(res.statusCode).toEqual(401);
    });
  });
});
