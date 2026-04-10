const request = require('supertest');
const { ObjectId } = require('mongodb');

const app = require('../app');
const { connectDB, getDB, closeDB } = require('../config/db');

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  const db = getDB();
  await db.collection('cart').deleteMany({});
  await db.collection('products').deleteMany({});
});

afterAll(async () => {
  await closeDB();
});

describe('Cart API', () => {
  it('should add an item to the cart successfully', async () => {
    const db = getDB();

    const product = {
      name: 'Gaming Mouse',
      description: 'High precision gaming mouse',
      price: 45.99,
      category: 'Electronics',
      stock: 20,
      brand: 'GameTech',
      imageUrl: 'https://example.com/gaming-mouse.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const productResult = await db.collection('products').insertOne(product);

    const cartData = {
      userId: 'user123',
      productId: productResult.insertedId.toString(),
      quantity: 2
    };

    const res = await request(app).post('/cart').send(cartData);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Item added to cart successfully');

    const savedCart = await db.collection('cart').findOne({ userId: 'user123' });

    expect(savedCart).not.toBeNull();
    expect(savedCart.items).toHaveLength(1);
    expect(savedCart.items[0].productId).toBe(productResult.insertedId.toString());
    expect(savedCart.items[0].quantity).toBe(2);
    expect(savedCart.totalPrice).toBe(91.98);
  });

  it('should return 400 when adding to cart with invalid data', async () => {
    const badCartData = {
      userId: '',
      productId: '',
      quantity: 0
    };

    const res = await request(app).post('/cart').send(badCartData);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('should return 400 when product ID format is invalid', async () => {
    const cartData = {
      userId: 'user123',
      productId: '123',
      quantity: 2
    };

    const res = await request(app).post('/cart').send(cartData);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid product ID format');
  });

  it('should return 404 when product is not found while adding to cart', async () => {
    const fakeId = new ObjectId();

    const cartData = {
      userId: 'user123',
      productId: fakeId.toString(),
      quantity: 2
    };

    const res = await request(app).post('/cart').send(cartData);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Product not found');
  });

  it('should get a cart by user ID', async () => {
    const db = getDB();

    const product = {
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      price: 60,
      category: 'Electronics',
      stock: 10,
      brand: 'KeyBrand',
      imageUrl: 'https://example.com/keyboard.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const productResult = await db.collection('products').insertOne(product);

    await db.collection('cart').insertOne({
      userId: 'user123',
      items: [
        {
          productId: productResult.insertedId.toString(),
          quantity: 3
        }
      ],
      totalPrice: 180,
      updatedAt: new Date()
    });

    const res = await request(app).get('/cart/user123');

    expect(res.statusCode).toBe(200);
    expect(res.body.userId).toBe('user123');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items[0].quantity).toBe(3);
  });

  it('should return 404 when cart is not found', async () => {
    const res = await request(app).get('/cart/user999');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Cart not found');
  });

  it('should update cart item quantity successfully', async () => {
    const db = getDB();

    const product = {
      name: 'Monitor',
      description: '24 inch monitor',
      price: 150,
      category: 'Electronics',
      stock: 8,
      brand: 'ViewPlus',
      imageUrl: 'https://example.com/monitor.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const productResult = await db.collection('products').insertOne(product);

    await db.collection('cart').insertOne({
      userId: 'user123',
      items: [
        {
          productId: productResult.insertedId.toString(),
          quantity: 2
        }
      ],
      totalPrice: 300,
      updatedAt: new Date()
    });

    const res = await request(app)
      .put(`/cart/user123/items/${productResult.insertedId.toString()}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});

    const updatedCart = await db.collection('cart').findOne({ userId: 'user123' });

    expect(updatedCart.items[0].quantity).toBe(5);
    expect(updatedCart.totalPrice).toBe(750);
  });

  it('should return 400 when updating cart item with invalid quantity', async () => {
    const db = getDB();

    const product = {
      name: 'Speaker',
      description: 'Bluetooth speaker',
      price: 80,
      category: 'Electronics',
      stock: 12,
      brand: 'SoundBox',
      imageUrl: 'https://example.com/speaker.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const productResult = await db.collection('products').insertOne(product);

    await db.collection('cart').insertOne({
      userId: 'user123',
      items: [
        {
          productId: productResult.insertedId.toString(),
          quantity: 1
        }
      ],
      totalPrice: 80,
      updatedAt: new Date()
    });

    const res = await request(app)
      .put(`/cart/user123/items/${productResult.insertedId.toString()}`)
      .send({ quantity: 0 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('should return 404 when updating cart for a user with no cart', async () => {
    const fakeProductId = new ObjectId().toString();

    const res = await request(app)
      .put(`/cart/user999/items/${fakeProductId}`)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Cart not found');
  });

  it('should return 404 when updating an item not found in cart', async () => {
    const db = getDB();

    const product = {
      name: 'Webcam',
      description: 'HD webcam',
      price: 70,
      category: 'Electronics',
      stock: 5,
      brand: 'CamPro',
      imageUrl: 'https://example.com/webcam.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('products').insertOne(product);

    await db.collection('cart').insertOne({
      userId: 'user123',
      items: [
        {
          productId: new ObjectId().toString(),
          quantity: 1
        }
      ],
      totalPrice: 70,
      updatedAt: new Date()
    });

    const missingProductId = new ObjectId().toString();

    const res = await request(app)
      .put(`/cart/user123/items/${missingProductId}`)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Item not found in cart');
  });

  it('should remove an item from the cart successfully', async () => {
    const db = getDB();

    const product = {
      name: 'Laptop Stand',
      description: 'Adjustable laptop stand',
      price: 35,
      category: 'Accessories',
      stock: 15,
      brand: 'StandUp',
      imageUrl: 'https://example.com/stand.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const productResult = await db.collection('products').insertOne(product);

    await db.collection('cart').insertOne({
      userId: 'user123',
      items: [
        {
          productId: productResult.insertedId.toString(),
          quantity: 2
        }
      ],
      totalPrice: 70,
      updatedAt: new Date()
    });

    const res = await request(app).delete(
      `/cart/user123/items/${productResult.insertedId.toString()}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Item removed from cart successfully');

    const updatedCart = await db.collection('cart').findOne({ userId: 'user123' });

    expect(updatedCart.items).toHaveLength(0);
    expect(updatedCart.totalPrice).toBe(0);
  });

  it('should return 404 when deleting from a cart that does not exist', async () => {
    const fakeProductId = new ObjectId().toString();

    const res = await request(app).delete(`/cart/user999/items/${fakeProductId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Cart not found');
  });

  it('should return 404 when deleting an item not found in cart', async () => {
    const db = getDB();

    const product = {
      name: 'USB Hub',
      description: '4-port USB hub',
      price: 25,
      category: 'Accessories',
      stock: 30,
      brand: 'HubMax',
      imageUrl: 'https://example.com/hub.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('products').insertOne(product);

    await db.collection('cart').insertOne({
      userId: 'user123',
      items: [
        {
          productId: new ObjectId().toString(),
          quantity: 1
        }
      ],
      totalPrice: 25,
      updatedAt: new Date()
    });

    const missingProductId = new ObjectId().toString();

    const res = await request(app).delete(`/cart/user123/items/${missingProductId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Item not found in cart');
  });
});
