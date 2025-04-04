import { Request, Response } from 'express';
import { OrderInput, OrderStatus } from '../models/interfaces';
import { OrderService } from '../services/OrderService';
import OrderRepository from '../repositories/OrderRepository';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    const orderRepository = OrderRepository.getInstance();
    this.orderService = new OrderService(orderRepository);
  }

  public createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const orderInput: OrderInput = req.body;
      const newOrder = this.orderService.createOrder(orderInput);
      res.status(201).json(newOrder);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const orderId = req.params.id;
      const order = this.orderService.getOrderById(orderId);
      res.status(200).json(order);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const orderId = req.params.id;
      const { status } = req.body;

      if (!Object.values(OrderStatus).includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const updatedOrder = this.orderService.updateOrderStatus(orderId, status);
      res.status(200).json(updatedOrder);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getOrdersByCustomerEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = req.query.email as string;
      
      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      const orders = this.orderService.getOrdersByCustomerEmail(email);
      res.status(200).json(orders);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getOrdersByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const statusParam = req.query.status as string;
      
      if (!statusParam || !Object.values(OrderStatus).includes(statusParam as OrderStatus)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const orders = this.orderService.getOrdersByStatus(statusParam as OrderStatus);
      res.status(200).json(orders);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = this.orderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 