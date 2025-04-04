import express from 'express';
import request from 'supertest';
import { OrderStatus } from './models/interfaces';
import { app } from './index';
import { AuthService } from './services/AuthService';

describe('Order Management API', () => {
  let authToken: string;
  let validOrder: any;
  let orderId: string;

  beforeAll(async () => {
    // Registrar un usuario y obtener el token
    const authService = new AuthService();
    const user = await authService.register({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });
    authToken = user.token;

    // Crear un pedido válido para las pruebas
    validOrder = {
      customer: {
        name: 'Test Customer',
        email: 'test@example.com'
      },
      products: [
        {
          name: 'Test Product',
          price: 100,
          quantity: 2
        }
      ]
    };
  });

  it('Should create an order correctly', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validOrder);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.customer.name).toBe(validOrder.customer.name);
    expect(response.body.customer.email).toBe(validOrder.customer.email);
    expect(response.body.total).toBe(200);
    expect(response.body.status).toBe(OrderStatus.PENDING);

    orderId = response.body.id;
  });

  it('Should get all orders', async () => {
    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('Should find orders by customer email', async () => {
    const response = await request(app)
      .get(`/api/orders/search?email=${validOrder.customer.email}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].customer.email).toBe(validOrder.customer.email);
  });

  it('Should find orders by status', async () => {
    const response = await request(app)
      .get(`/api/orders/status?status=${OrderStatus.PENDING}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].status).toBe(OrderStatus.PENDING);
  });

  it('Should get an order by ID', async () => {
    const response = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(orderId);
  });

  it('Should update an order status', async () => {
    const response = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: OrderStatus.PROCESSING });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(orderId);
    expect(response.body.status).toBe(OrderStatus.PROCESSING);
  });

  it('Should not allow updating to an invalid status', async () => {
    const response = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: OrderStatus.PENDING });

    expect(response.status).toBe(400);
  });

  it('Should reject an order with invalid data', async () => {
    const invalidOrder = {
      customer: {
        name: '',
        email: 'invalid-email'
      },
      products: [
        {
          name: '',
          price: -100,
          quantity: 0
        }
      ]
    };

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidOrder);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(Array.isArray(response.body.errors)).toBe(true);
  });
}); 