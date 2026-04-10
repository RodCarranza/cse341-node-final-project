const request = require('supertest');
const app = require('../app');
const { connectDB, getDB, closeDB } = require('../config/db');

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  const db = getDB();
  await db.collection('products').deleteMany({});
});

afterAll(async () => {
  await closeDB();
});

describe('Products API', () => {
  it('should return all products', async () => {
    const res = await request(app).get('/products');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a product with valid data', async () => {
    const productData = {
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      price: 79.99,
      category: 'Electronics',
      stock: 20,
      brand: 'KeyBrand',
      imageUrl: 'https://example.com/keyboard.jpg'
    };

    const res = await request(app).post('/products').send(productData);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Product created successfully');
  });

  it('should return 400 for invalid product data', async () => {
    const badProduct = {
      name: 'A',
      description: '',
      price: -5,
      category: '',
      stock: -1,
      brand: '',
      imageUrl: 'not-a-url'
    };

    const res = await request(app).post('/products').send(badProduct);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
  });
});
