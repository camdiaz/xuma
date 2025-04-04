import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const { method, path, body, params, query } = req;
  
  logger.info(`Request received: ${method} ${path}`, { method, path, body, params, query });
  
  const start = Date.now();
  const originalSend = res.send;

  res.send = function(body: any) {
    const responseTime = Date.now() - start;
    logger.info(`Response sent: ${res.statusCode}`, { 
      statusCode: res.statusCode, 
      responseTime: `${responseTime}ms` 
    });
    
    return originalSend.call(this, body);
  };
  
  next();
}; 