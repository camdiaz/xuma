import { Order, OrderStatus } from '../models/interfaces';

export interface IOrderRepository {
  save(order: Order): Order;
  findById(id: string): Order | null;
  findByCustomerEmail(email: string): Order[];
  findByStatus(status: OrderStatus): Order[];
  update(id: string, order: Partial<Order>): Order | null;
  getAll(): Order[];
}

class OrderRepository implements IOrderRepository {
  private static instance: OrderRepository;
  private orders: Map<string, Order>;

  private constructor() {
    this.orders = new Map<string, Order>();
  }

  public static getInstance(): OrderRepository {
    if (!OrderRepository.instance) {
      OrderRepository.instance = new OrderRepository();
    }
    return OrderRepository.instance;
  }

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

export default OrderRepository; 