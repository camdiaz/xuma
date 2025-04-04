import express from 'express';
import { setupSwagger } from './utils/swagger';
import logger from './utils/logger';
import orderRoutes from './routes/OrderRoutes';
import authRoutes from './routes/AuthRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setupSwagger(app);

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
    logger.info(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  });
}

export { app }; 