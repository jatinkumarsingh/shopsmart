const {
  getAllProducts,
  getProductById,
  createProduct,
} = require('../../src/controllers/product.controller');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client', () => {
  const mPrisma = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('Product Controller', () => {
  let req, res, prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, name: 'P1' },
        { id: 2, name: 'P2' },
      ];
      prisma.product.findMany.mockResolvedValue(mockProducts);

      await getAllProducts(req, res);

      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      req.params.id = '1';
      const mockProduct = { id: 1, name: 'P1' };
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      await getProductById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      req.params.id = '999';
      prisma.product.findUnique.mockResolvedValue(null);

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      req.body = { name: 'P1', price: '100', description: 'Desc', imageUrl: 'img.jpg' };
      const mockProduct = { id: 1, name: 'P1', price: 100 };
      prisma.product.create.mockResolvedValue(mockProduct);

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });
  });
});
