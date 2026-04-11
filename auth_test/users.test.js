const request = require('supertest');
const app = require('../app');
const { connectDB, closeDB } = require('../config/db');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

describe('Users API - Unauthorized access', () => {
  it('should return 401 for GET /users/profile when not logged in', async () => {
    const res = await request(app).get('/users/profile');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Unauthorized. Please log in first.');
  });

  it('should return 401 for DELETE /users/me when not logged in', async () => {
    const res = await request(app).delete('/users/me');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Unauthorized. Please log in first.');
  });
});
