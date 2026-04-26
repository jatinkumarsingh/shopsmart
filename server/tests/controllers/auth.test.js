const { signup, login } = require('../../src/controllers/auth.controller');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('@prisma/client', () => {
  const mPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('Auth Controller', () => {
  let req, res, prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
    req = {
      body: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user and return a token', async () => {
      req.body = { email: 'test@example.com', password: 'password123', name: 'Test User' };
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue({ id: 1, email: 'test@example.com', name: 'Test User' });
      jwt.sign.mockReturnValue('mockToken');

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        token: 'mockToken',
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
      });
    });

    it('should return 400 if user already exists', async () => {
      req.body = { email: 'existing@example.com' };
      prisma.user.findUnique.mockResolvedValue({ id: 1 });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should login and return a token if credentials are valid', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        token: 'mockToken',
        user: { id: 1, email: 'test@example.com' },
      });
    });

    it('should return 401 for invalid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      prisma.user.findUnique.mockResolvedValue({ id: 1, password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
