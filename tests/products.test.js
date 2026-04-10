const request = require('supertest');
const { ObjectId } = require('mongodb');

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
    expect(res.body.productId).toBeDefined();
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

  it('should return a product by ID', async () => {
    const db = getDB();

    const product = {
      name: 'Monitor',
      description: '27 inch monitor',
      price: 199.99,
      category: 'Electronics',
      stock: 15,
      brand: 'ViewTech',
      imageUrl: 'https://example.com/monitor.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('products').insertOne(product);

    const res = await request(app).get(`/products/${result.insertedId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(result.insertedId.toString());
    expect(res.body.name).toBe('Monitor');
  });

  it('should return 400 for invalid product ID format', async () => {
    const res = await request(app).get('/products/123');

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid product ID format');
  });

  it('should return 404 if product is not found', async () => {
    const fakeId = new ObjectId();

    const res = await request(app).get(`/products/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Product not found');
  });

  it('should update a product successfully', async () => {
    const db = getDB();

    const product = {
      name: 'Mouse',
      description: 'Wireless mouse',
      price: 29.99,
      category: 'Electronics',
      stock: 30,
      brand: 'TechBrand',
      imageUrl: 'https://example.com/mouse.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('products').insertOne(product);

    const updatedData = {
      name: 'Updated Mouse',
      description: 'Updated wireless mouse',
      price: 39.99,
      category: 'Electronics',
      stock: 25,
      brand: 'TechBrand',
      imageUrl: 'https://example.com/updated-mouse.jpg'
    };

    const res = await request(app).put(`/products/${result.insertedId}`).send(updatedData);

    expect(res.statusCode).toBe(204);

    const updatedProduct = await db.collection('products').findOne({
      _id: result.insertedId
    });

    expect(updatedProduct.name).toBe('Updated Mouse');
    expect(updatedProduct.price).toBe(39.99);
  });

  it('should return 400 when updating with invalid data', async () => {
    const db = getDB();

    const product = {
      name: 'Tablet',
      description: 'Android tablet',
      price: 199.99,
      category: 'Electronics',
      stock: 10,
      brand: 'TabBrand',
      imageUrl: 'https://example.com/tablet.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('products').insertOne(product);

    const invalidUpdate = {
      name: 'A',
      description: '',
      price: -10,
      category: '',
      stock: -5,
      brand: '',
      imageUrl: 'invalid-url'
    };

    const res = await request(app).put(`/products/${result.insertedId}`).send(invalidUpdate);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('should delete a product successfully', async () => {
    const db = getDB();

    const product = {
      name: 'Headphones',
      description: 'Noise cancelling headphones',
      price: 149.99,
      category: 'Electronics',
      stock: 10,
      brand: 'SoundMax',
      imageUrl: 'https://example.com/headphones.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('products').insertOne(product);

    const res = await request(app).delete(`/products/${result.insertedId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');

    const deletedProduct = await db.collection('products').findOne({
      _id: result.insertedId
    });

    expect(deletedProduct).toBeNull();
  });

  it('should return 400 for invalid product ID when deleting', async () => {
    const res = await request(app).delete('/products/123');

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid product ID format');
  });

  it('should return 404 when deleting a non-existing product', async () => {
    const fakeId = new ObjectId();

    const res = await request(app).delete(`/products/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Product not found');
  });
});
