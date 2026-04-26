const request = require('supertest');
const app = require('../../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Product Integration Tests (API + DB)', () => {
  let testProductId;
  let authToken;

  const testUser = {
    email: 'prod_test@example.com',
    password: 'password123',
    name: 'Product Tester',
  };

  const testProduct = {
    name: 'Int Test Product',
    description: 'Test Description',
    price: 99.99,
    imageUrl: 'http://example.com/img.jpg',
  };

  beforeAll(async () => {
    // Create a user and get token for protected routes
    await request(app).post('/api/auth/signup').send(testUser);
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    authToken = `Bearer ${loginRes.body.token}`;
  });

  afterAll(async () => {
    // Clean up and disconnect
    if (testProductId) {
      await prisma.product.deleteMany({
        where: { id: testProductId },
      });
    }
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/products', () => {
    it('should create a new product in the database when authenticated', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', authToken)
        .send(testProduct);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toEqual(testProduct.name);
      testProductId = res.body.id;

      // Verify in DB
      const dbProduct = await prisma.product.findUnique({
        where: { id: testProductId },
      });
      expect(dbProduct).not.toBeNull();
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).post('/api/products').send(testProduct);

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/products', () => {
    it('should retrieve all products including the test one', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.some((p) => p.id === testProductId)).toBeTruthy();
    });
  });

  describe('GET /api/products/:id', () => {
    it('should retrieve the product by its ID', async () => {
      const res = await request(app).get(`/api/products/${testProductId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual(testProduct.name);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update the product in the database when authenticated', async () => {
      const updatedData = { ...testProduct, price: 129.99 };
      const res = await request(app)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', authToken)
        .send(updatedData);

      expect(res.statusCode).toEqual(200);
      expect(parseFloat(res.body.price)).toEqual(129.99);

      // Verify in DB
      const dbProduct = await prisma.product.findUnique({
        where: { id: testProductId },
      });
      expect(dbProduct.price).toEqual(129.99);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete the product from the database when authenticated', async () => {
      const res = await request(app)
        .delete(`/api/products/${testProductId}`)
        .set('Authorization', authToken);

      expect(res.statusCode).toEqual(200);

      // Verify deletion in DB
      const dbProduct = await prisma.product.findUnique({
        where: { id: testProductId },
      });
      expect(dbProduct).toBeNull();
    });
  });
});
