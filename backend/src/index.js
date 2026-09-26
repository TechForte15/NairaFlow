import 'dotenv/config';
import express from 'express';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'NairaFlow API is running', data: null });
});

app.use('/api', routes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`NairaFlow backend listening on port ${port}`);
});