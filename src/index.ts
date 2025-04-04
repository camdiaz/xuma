import express, { Request, Response } from 'express';
import orderRoutes from './routes/OrderRoutes';
import { requestLogger } from './middleware/logging';
import logger from './utils/logger';
import { setupSwagger } from './utils/swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);

setupSwagger(app);

// Routes
app.use('/api/orders', orderRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Order Management API');
});

app.use((req: Request, res: Response) => {
  logger.warning(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
  logger.info(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

export default app; 