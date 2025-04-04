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
      name: 'Camila Diaz',
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
    it('should create an order correctly', () => {
      const order = orderService.createOrder(validOrderInput);
      
      expect(order.id).toBeDefined();
      expect(order.date).toBeInstanceOf(Date);
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.customer).toEqual(validOrderInput.customer);
      expect(order.products).toEqual(validOrderInput.products);
      expect(order.total).toBe(250); // (100 * 2) + (50 * 1)
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
    it('should update status from pending to processing', () => {
      const order = orderService.createOrder(validOrderInput);
      const updatedOrder = orderService.updateOrderStatus(order.id, OrderStatus.PROCESSING);
      expect(updatedOrder.status).toBe(OrderStatus.PROCESSING);
    });

    it('should update status from processing to completed', () => {
      const order = orderService.createOrder(validOrderInput);
      let updatedOrder = orderService.updateOrderStatus(order.id, OrderStatus.PROCESSING);
      updatedOrder = orderService.updateOrderStatus(order.id, OrderStatus.COMPLETED);
      expect(updatedOrder.status).toBe(OrderStatus.COMPLETED);
    });

    it('should throw error when trying to change from pending to completed', () => {
      const order = orderService.createOrder(validOrderInput);
      expect(() => {
        orderService.updateOrderStatus(order.id, OrderStatus.COMPLETED);
      }).toThrow();
    });

    it('should throw error when trying to update a completed order', () => {
      const order = orderService.createOrder(validOrderInput);
      let updatedOrder = orderService.updateOrderStatus(order.id, OrderStatus.PROCESSING);
      updatedOrder = orderService.updateOrderStatus(order.id, OrderStatus.COMPLETED);
      expect(() => {
        orderService.updateOrderStatus(order.id, OrderStatus.PROCESSING);
      }).toThrow();
    });
  });

  describe('getOrdersByCustomerEmail', () => {
    it('should get orders by customer email', () => {
      orderService.createOrder(validOrderInput);
      orderService.createOrder(validOrderInput);
      orderService.createOrder({
        customer: {
          name: 'Maria Lopez',
          email: 'maria@example.com'
        },
        products: [
          {
            name: 'Product 3',
            price: 200,
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
      const order1 = orderService.createOrder(validOrderInput);
      const order2 = orderService.createOrder(validOrderInput);
      orderService.updateOrderStatus(order1.id, OrderStatus.PROCESSING);
      
      const pendingOrders = orderService.getOrdersByStatus(OrderStatus.PENDING);
      expect(pendingOrders.length).toBe(1);
      
      const processingOrders = orderService.getOrdersByStatus(OrderStatus.PROCESSING);
      expect(processingOrders.length).toBe(1);
    });
  });
});