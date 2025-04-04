import { OrderService } from './OrderService';
import { Order, OrderInput, OrderStatus, Product } from '../models/interfaces';
import OrderRepository, { IOrderRepository } from '../repositories/OrderRepository';

class MockOrderRepository implements IOrderRepository {
  private orders: Map<string, Order> = new Map();

  save(order: Order): Order {
    this.orders.set(order.id, order);
    return order;
  }

  findById(id: string): Order | null {
    return this.orders.get(id) || null;
  }

  findByCustomerEmail(email: string): Order[] {
    return Array.from(this.orders.values()).filter(
      order => order.customer.email === email
    );
  }

  findByStatus(status: OrderStatus): Order[] {
    return Array.from(this.orders.values()).filter(
      order => order.status === status
    );
  }

  update(id: string, orderData: Partial<Order>): Order | null {
    const order = this.findById(id);
    
    if (!order) {
      return null;
    }

    const updatedOrder = { ...order, ...orderData };
    this.orders.set(id, updatedOrder);
    
    return updatedOrder;
  }

  getAll(): Order[] {
    return Array.from(this.orders.values());
  }
}

describe('OrderService', () => {
  let orderService: OrderService;
  let mockRepository: IOrderRepository;

  beforeEach(() => {
    mockRepository = new MockOrderRepository();
    orderService = new OrderService(mockRepository);
  });

  const validOrderInput: OrderInput = {
    customer: {
      name: 'camila diaz',
      email: 'cam@example.com'
    },
    products: [
      {
        name: 'Product 1',
        price: 100,
        quantity: 2
      },
      {
        name: 'Product 2',
        price: 50,
        quantity: 1
      }
    ]
  };

  describe('createOrder', () => {
    it('should create an order with valid data', () => {
      const orderData = {
        customer: {
          name: 'juan perez',
          email: 'juan@example.com'
        },
        products: [
          {
            name: 'producto 1',
            price: 100,
            quantity: 2
          }
        ]
      };

      const order = orderService.createOrder(orderData);

      expect(order.id).toBeDefined();
      expect(order.customer.name).toBe(orderData.customer.name);
      expect(order.customer.email).toBe(orderData.customer.email);
      expect(order.products).toHaveLength(1);
      expect(order.total).toBe(200);
      expect(order.status).toBe(OrderStatus.PENDING);
    });

    it('should throw error if customer data is missing', () => {
      const invalidInput = {
        ...validOrderInput,
        customer: { name: '', email: '' }
      };

      expect(() => {
        orderService.createOrder(invalidInput);
      }).toThrow();
    });

    it('should throw error if there are no products', () => {
      const invalidInput = {
        ...validOrderInput,
        products: []
      };

      expect(() => {
        orderService.createOrder(invalidInput);
      }).toThrow();
    });

    it('should throw error if products have invalid price or quantity', () => {
      const invalidInput = {
        ...validOrderInput,
        products: [
          {
            name: 'Invalid Product',
            price: -10,
            quantity: 2
          }
        ]
      };

      expect(() => {
        orderService.createOrder(invalidInput);
      }).toThrow();
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status correctly', () => {
      const orderData = {
        customer: {
          name: 'maria garcia',
          email: 'maria@example.com'
        },
        products: [
          {
            name: 'producto 2',
            price: 50,
            quantity: 1
          }
        ]
      };

      const order = orderService.createOrder(orderData);
      const updatedOrder = orderService.updateOrderStatus(order.id, OrderStatus.PROCESSING);

      expect(updatedOrder.status).toBe(OrderStatus.PROCESSING);
    });

    it('should throw error for invalid status transition', () => {
      const orderData = {
        customer: {
          name: 'pedro lopez',
          email: 'pedro@example.com'
        },
        products: [
          {
            name: 'producto 3',
            price: 75,
            quantity: 3
          }
        ]
      };

      const order = orderService.createOrder(orderData);
      orderService.updateOrderStatus(order.id, OrderStatus.PROCESSING);

      expect(() => {
        orderService.updateOrderStatus(order.id, OrderStatus.PENDING);
      }).toThrow('Cannot change from processing to pending. Only allowed to change to completed or cancelled');
    });
  });

  describe('getOrdersByCustomerEmail', () => {
    it('should get orders by customer email', () => {
      orderService.createOrder({
        customer: {
          name: 'juan perez',
          email: 'juan@example.com'
        },
        products: [
          {
            name: 'producto 1',
            price: 100,
            quantity: 1
          }
        ]
      });

      orderService.createOrder({
        customer: {
          name: 'juan perez',
          email: 'juan@example.com'
        },
        products: [
          {
            name: 'producto 2',
            price: 200,
            quantity: 1
          }
        ]
      });

      orderService.createOrder({
        customer: {
          name: 'maria garcia',
          email: 'maria@example.com'
        },
        products: [
          {
            name: 'producto 3',
            price: 150,
            quantity: 1
          }
        ]
      });

      const juanOrders = orderService.getOrdersByCustomerEmail('juan@example.com');
      expect(juanOrders.length).toBe(2);
      
      const mariaOrders = orderService.getOrdersByCustomerEmail('maria@example.com');
      expect(mariaOrders.length).toBe(1);
    });
  });

  describe('getOrdersByStatus', () => {
    it('should get orders by status', () => {
      const order1 = orderService.createOrder({
        customer: {
          name: 'cliente 1',
          email: 'cliente1@example.com'
        },
        products: [
          {
            name: 'producto 1',
            price: 100,
            quantity: 1
          }
        ]
      });

      const order2 = orderService.createOrder({
        customer: {
          name: 'cliente 2',
          email: 'cliente2@example.com'
        },
        products: [
          {
            name: 'producto 2',
            price: 200,
            quantity: 1
          }
        ]
      });

      orderService.updateOrderStatus(order2.id, OrderStatus.PROCESSING);

      const pendingOrders = orderService.getOrdersByStatus(OrderStatus.PENDING);
      expect(pendingOrders.length).toBe(1);

      const processingOrders = orderService.getOrdersByStatus(OrderStatus.PROCESSING);
      expect(processingOrders.length).toBe(1);
    });
  });
});