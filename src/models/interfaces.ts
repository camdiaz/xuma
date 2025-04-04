/**
 * @swagger
 * components:
 *   schemas:
 *     OrderStatus:
 *       type: string
 *       enum:
 *         - pending
 *         - processing
 *         - completed
 *         - cancelled
 *       description: Status of the order
 * 
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: Customer name
 *         email:
 *           type: string
 *           format: email
 *           description: Customer email
 * 
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - quantity
 *       properties:
 *         name:
 *           type: string
 *           description: Product name
 *         price:
 *           type: number
 *           format: float
 *           description: Product price per unit
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Product quantity
 * 
 *     Order:
 *       type: object
 *       required:
 *         - id
 *         - date
 *         - status
 *         - customer
 *         - products
 *         - total
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Order unique identifier
 *         date:
 *           type: string
 *           format: date-time
 *           description: Order creation date
 *         status:
 *           $ref: '#/components/schemas/OrderStatus'
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *           description: List of products in the order
 *         total:
 *           type: number
 *           format: float
 *           description: Total order amount
 * 
 *     OrderInput:
 *       type: object
 *       required:
 *         - customer
 *         - products
 *       properties:
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *           description: List of products in the order
 *         status:
 *           $ref: '#/components/schemas/OrderStatus'
 *         date:
 *           type: string
 *           format: date-time
 *           description: Order creation date
 * 
 *     OrderUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           $ref: '#/components/schemas/OrderStatus'
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 * 
 *     ValidationError:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           description: List of validation errors
 * 
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User unique identifier
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         name:
 *           type: string
 *           description: User name
 *         password:
 *           type: string
 *           description: Hashed password (only returned in registration)
 * 
 *     UserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         password:
 *           type: string
 *           description: User password
 *         name:
 *           type: string
 *           description: User name
 * 
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         password:
 *           type: string
 *           description: User password
 * 
 *     AuthResponse:
 *       type: object
 *       required:
 *         - user
 *         - token
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT token for authentication
 */

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Customer {
  name: string;
  email: string;
}

export interface Product {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: Date;
  status: OrderStatus;
  customer: Customer;
  products: Product[];
  total: number;
}

export interface OrderInput {
  customer: Customer;
  products: Product[];
  status?: OrderStatus;
  date?: Date;
}

export interface OrderUpdate {
  status: OrderStatus;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
} 