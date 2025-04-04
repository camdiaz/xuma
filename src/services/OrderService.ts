import { v4 as uuidv4 } from 'uuid';
import { Order, OrderInput, OrderStatus, Product } from '../models/interfaces';
import OrderRepository, { IOrderRepository } from '../repositories/OrderRepository';

export class OrderService {
  private orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  public createOrder(orderInput: OrderInput): Order {
    this.validateOrderInput(orderInput);
    const total = this.calculateTotal(orderInput.products);

    const order: Order = {
      id: uuidv4(),
      date: orderInput.date || new Date(),
      status: orderInput.status || OrderStatus.PENDING,
      customer: orderInput.customer,
      products: orderInput.products,
      total
    };

    return this.orderRepository.save(order);
  }

  public updateOrderStatus(id: string, newStatus: OrderStatus): Order {
    const order = this.orderRepository.findById(id);
    
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    this.validateStatusTransition(order.status, newStatus);

    const updatedOrder = this.orderRepository.update(id, { status: newStatus });
    
    if (!updatedOrder) {
      throw new Error(`Could not update order with ID ${id}`);
    }

    return updatedOrder;
  }

  public getOrderById(id: string): Order {
    const order = this.orderRepository.findById(id);
    
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    return order;
  }

  public getOrdersByCustomerEmail(email: string): Order[] {
    return this.orderRepository.findByCustomerEmail(email);
  }

  public getOrdersByStatus(status: OrderStatus): Order[] {
    return this.orderRepository.findByStatus(status);
  }

  public getAllOrders(): Order[] {
    return this.orderRepository.getAll();
  }

  private calculateTotal(products: Product[]): number {
    return products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  }

  private validateOrderInput(orderInput: OrderInput): void {
    if (!orderInput.customer || !orderInput.customer.name || !orderInput.customer.email) {
      throw new Error('Customer must have name and email');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderInput.customer.email)) {
      throw new Error('Customer email is not valid');
    }

    if (!orderInput.products || orderInput.products.length === 0) {
      throw new Error('Order must contain at least one product');
    }

    orderInput.products.forEach((product, index) => {
      if (!product.name) {
        throw new Error(`Product at position ${index} must have a name`);
      }
      if (product.price <= 0) {
        throw new Error(`Product ${product.name} must have a price greater than 0`);
      }
      if (product.quantity <= 0) {
        throw new Error(`Product ${product.name} must have a quantity greater than 0`);
      }
    });
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    if (currentStatus === OrderStatus.COMPLETED || currentStatus === OrderStatus.CANCELLED) {
      throw new Error(`Cannot change status of a ${currentStatus} order`);
    }

    if (currentStatus === OrderStatus.PENDING && newStatus !== OrderStatus.PROCESSING) {
      throw new Error(`Cannot change from ${currentStatus} to ${newStatus}. Only allowed to change to ${OrderStatus.PROCESSING}`);
    }

    if (currentStatus === OrderStatus.PROCESSING && 
        newStatus !== OrderStatus.COMPLETED && 
        newStatus !== OrderStatus.CANCELLED) {
      throw new Error(`Cannot change from ${currentStatus} to ${newStatus}. Only allowed to change to ${OrderStatus.COMPLETED} or ${OrderStatus.CANCELLED}`);
    }
  }
} 