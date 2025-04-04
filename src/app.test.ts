import request from 'supertest';
import app from './index';
import { OrderStatus } from './models/interfaces';

describe('Order Management API', () => {
  const validOrder = {
    customer: {
      name: 'Test Customer',
      email: 'customer@test.com'
    },
    products: [
      {
        name: 'Test product',
        price: 100,
        quantity: 2
      }
    ]
  };

  let orderId: string;

  it('Should create an order correctly', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send(validOrder);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.customer.name).toBe(validOrder.customer.name);
    expect(response.body.customer.email).toBe(validOrder.customer.email);
    expect(response.body.products).toHaveLength(1);
    expect(response.body.total).toBe(200); // 100 * 2
    expect(response.body.status).toBe(OrderStatus.PENDING);

    orderId = response.body.id;
  });

  it('Should get all orders', async () => {
    const response = await request(app)
      .get('/api/orders');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('Should find orders by customer email', async () => {
    const response = await request(app)
      .get(`/api/orders/search?email=${validOrder.customer.email}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].customer.email).toBe(validOrder.customer.email);
  });

  it('Should find orders by status', async () => {
    const response = await request(app)
      .get(`/api/orders/status?status=${OrderStatus.PENDING}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].status).toBe(OrderStatus.PENDING);
  });

  it('Should get an order by ID', async () => {
    const response = await request(app)
      .get(`/api/orders/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(orderId);
  });

  it('Should update an order status', async () => {
    const response = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .send({ status: OrderStatus.PROCESSING });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(orderId);
    expect(response.body.status).toBe(OrderStatus.PROCESSING);
  });

  it('Should not allow updating to an invalid status', async () => {
    const response = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .send({ status: OrderStatus.PENDING });

    expect(response.status).toBe(400);
  });

  it('Should reject an order with invalid data', async () => {
    const invalidOrder = {
      customer: {
        name: '',
        email: 'invalid-email'
      },
      products: []
    };

    const response = await request(app)
      .post('/api/orders')
      .send(invalidOrder);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(Array.isArray(response.body.errors)).toBe(true);
  });
}); 