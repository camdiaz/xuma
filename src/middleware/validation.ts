import { Request, Response, NextFunction } from 'express';
import { OrderInput, OrderStatus } from '../models/interfaces';
import logger from '../utils/logger';

export const validateOrderInput = (req: Request, res: Response, next: NextFunction): void => {
  const orderInput = req.body as OrderInput;
  const errors: string[] = [];

  if (!orderInput.customer) {
    errors.push('Customer information is required');
  } else {
    if (!orderInput.customer.name) {
      errors.push('Customer name is required');
    }
    if (!orderInput.customer.email) {
      errors.push('Customer email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(orderInput.customer.email)) {
        errors.push('Invalid email format');
      }
    }
  }

  if (!orderInput.products || !Array.isArray(orderInput.products) || orderInput.products.length === 0) {
    errors.push('At least one product is required');
  } else {
    orderInput.products.forEach((product, index) => {
      if (!product.name) {
        errors.push(`Product at position ${index} must have a name`);
      }
      if (typeof product.price !== 'number' || product.price <= 0) {
        errors.push(`Product ${product.name || `at position ${index}`} must have a price greater than 0`);
      }
      if (typeof product.quantity !== 'number' || product.quantity <= 0 || !Number.isInteger(product.quantity)) {
        errors.push(`Product ${product.name || `at position ${index}`} must have a quantity greater than 0 and be an integer`);
      }
    });
  }

  if (errors.length > 0) {
    logger.warning('Validation failed on order creation', { errors, body: req.body });
    res.status(400).json({ errors });
    return;
  }
  next();
};

export const validateStatusUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { status } = req.body;
  if (!status || !Object.values(OrderStatus).includes(status)) {
    logger.warning('Invalid status in order update', { status, orderId: req.params.id });
    res.status(400).json({ error: 'Invalid status. Must be: pending, processing, completed or cancelled' });
    return;
  }

  next();
}; 