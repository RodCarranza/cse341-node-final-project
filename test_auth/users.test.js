const request = require('supertest');
const app = require('../app');
const { connectDB, closeDB } = require('../config/db');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

describe('Unauthorized access - Protected routes', () => {
  // USERS
  it('should return 401 for GET /users/profile', async () => {
    const res = await request(app).get('/users/profile');

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for DELETE /users/me', async () => {
    const res = await request(app).delete('/users/me');

    expect(res.statusCode).toBe(401);
  });

  // PRODUCTS (protected ones only)
  it('should return 401 for POST /products', async () => {
    const res = await request(app).post('/products').send({});

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for PUT /products/:id', async () => {
    const res = await request(app).put('/products/64c123abc123abc123abc123').send({});

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for DELETE /products/:id', async () => {
    const res = await request(app).delete('/products/64c123abc123abc123abc123');

    expect(res.statusCode).toBe(401);
  });

  // CART
  it('should return 401 for POST /cart', async () => {
    const res = await request(app).post('/cart').send({});

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for GET /cart/:userId', async () => {
    const res = await request(app).get('/cart/user123');

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for PUT /cart/:userId/items/:productId', async () => {
    const res = await request(app)
      .put('/cart/user123/items/64c123abc123abc123abc123')
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for DELETE /cart/:userId/items/:productId', async () => {
    const res = await request(app).delete('/cart/user123/items/64c123abc123abc123abc123');

    expect(res.statusCode).toBe(401);
  });

  // ORDERS
  it('should return 401 for GET /orders', async () => {
    const res = await request(app).get('/orders');

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for POST /orders', async () => {
    const res = await request(app).post('/orders').send({});

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for PUT /orders/:id', async () => {
    const res = await request(app).put('/orders/64c123abc123abc123abc123').send({});

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for DELETE /orders/:id', async () => {
    const res = await request(app).delete('/orders/64c123abc123abc123abc123');

    expect(res.statusCode).toBe(401);
  });
});
