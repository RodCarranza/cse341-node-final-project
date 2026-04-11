const request = require('supertest');
const { ObjectId } = require('mongodb');

const app = require('../app');
const { connectDB, getDB, closeDB } = require('../config/db');

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  const db = getDB();
  await db.collection('orders').deleteMany({});
});

afterAll(async () => {
  await closeDB();
});

describe('Orders API', () => {
  it('should return all orders', async () => {
    const res = await request(app).get('/orders');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create an order with valid data', async () => {
    const orderData = {
      userId: 'user123',
      items: [
        {
          productId: new ObjectId().toString(),
          quantity: 2
        }
      ],
      totalAmount: 59.98,
      status: 'pending',
      shippingAddress: 'San Salvador, El Salvador',
      paymentMethod: 'credit card'
    };

    const res = await request(app).post('/orders').send(orderData);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Order created successfully');
    expect(res.body.orderId).toBeDefined();
  });

  it('should return 400 for invalid order data', async () => {
    const badOrderData = {
      userId: '',
      items: [],
      totalAmount: -5,
      status: 'wrong-status',
      shippingAddress: '',
      paymentMethod: ''
    };

    const res = await request(app).post('/orders').send(badOrderData);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('should return an order by ID', async () => {
    const db = getDB();

    const order = {
      userId: 'user123',
      items: [
        {
          productId: new ObjectId().toString(),
          quantity: 2
        }
      ],
      totalAmount: 59.98,
      status: 'pending',
      shippingAddress: 'San Salvador, El Salvador',
      paymentMethod: 'credit card',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);

    const res = await request(app).get(`/orders/${result.insertedId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(result.insertedId.toString());
    expect(res.body.userId).toBe('user123');
    expect(res.body.status).toBe('pending');
  });

  it('should return 400 for invalid order ID format', async () => {
    const res = await request(app).get('/orders/123');

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid order ID format');
  });

  it('should return 404 if order is not found', async () => {
    const fakeId = new ObjectId();

    const res = await request(app).get(`/orders/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Order not found');
  });

  it('should update an order successfully', async () => {
    const db = getDB();

    const order = {
      userId: 'user123',
      items: [
        {
          productId: new ObjectId().toString(),
          quantity: 2
        }
      ],
      totalAmount: 59.98,
      status: 'pending',
      shippingAddress: 'San Salvador, El Salvador',
      paymentMethod: 'credit card',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);

    const updatedData = {
      userId: 'user123',
      items: [
        {
          productId: new ObjectId().toString(),
          quantity: 3
        }
      ],
      totalAmount: 89.97,
      status: 'processing',
      shippingAddress: 'San Salvador, El Salvador',
      paymentMethod: 'credit card'
    };

    const res = await request(app).put(`/orders/${result.insertedId}`).send(updatedData);

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});

    const updatedOrder = await db.collection('orders').findOne({
      _id: result.insertedId
    });

    expect(updatedOrder.status).toBe('processing');
    expect(updatedOrder.totalAmount).toBe(89.97);
    expect(updatedOrder.items[0].quantity).toBe(3);
  });

  it('should return 400 when updating with invalid order data', async () => {
    const db = getDB();

    const order = {
      userId: 'user123',
      items: [
        {
          productId: new ObjectId().toString(),
          quantity: 1
        }
      ],
      totalAmount: 30,
      status: 'pending',
      shippingAddress: 'San Salvador, El Salvador',
      paymentMethod: 'credit card',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);

    const invalidUpdate = {
      userId: '',
      items: [],
      totalAmount: -10,
      status: 'bad-status',
      shippingAddress: '',
      paymentMethod: ''
    };

    const res = await request(app).put(`/orders/${result.insertedId}`).send(invalidUpdate);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('should return 400 for invalid order ID when updating', async () => {
    const validUpdate = {
      userId: 'user123',
      items: [
        {
          productId: new ObjectId().toString(),
          quantity: 2
        }
      ],
      totalAmount: 59.98,
      status: 'processing',
      shippingAddress: 'San Salvador, El Salvador',
      paymentMethod: 'credit card'
    };

    const res = await request(app).put('/orders/123').send(validUpdate);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid order ID format');
  });

  it('should return 404 when updating a non-existing order', async () => {
    const fakeId = new ObjectId();

    const validUpdate = {
      userId: 'user123',
      items: [
        {
          productId: new ObjectId().toString(),
          quantity: 2
        }
      ],
      totalAmount: 59.98,
      status: 'processing',
      shippingAddress: 'San Salvador, El Salvador',
      paymentMethod: 'credit card'
    };

    const res = await request(app).put(`/orders/${fakeId}`).send(validUpdate);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Order not found');
  });

  it('should delete an order successfully', async () => {
    const db = getDB();

    const order = {
      userId: 'user123',
      items: [
        {
          productId: new ObjectId().toString(),
          quantity: 2
        }
      ],
      totalAmount: 59.98,
      status: 'pending',
      shippingAddress: 'San Salvador, El Salvador',
      paymentMethod: 'credit card',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);

    const res = await request(app).delete(`/orders/${result.insertedId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Order deleted successfully');

    const deletedOrder = await db.collection('orders').findOne({
      _id: result.insertedId
    });

    expect(deletedOrder).toBeNull();
  });

  it('should return 400 for invalid order ID when deleting', async () => {
    const res = await request(app).delete('/orders/123');

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid order ID format');
  });

  it('should return 404 when deleting a non-existing order', async () => {
    const fakeId = new ObjectId();

    const res = await request(app).delete(`/orders/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Order not found');
  });
});
