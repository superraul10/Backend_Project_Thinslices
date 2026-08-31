import express from 'express';
import type { Request, Response } from 'express';
import authRouter from './routes/authRouter.js';
import recipeRouter from './routes/recipeRouter.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript Express!');
});

app.use('/auth', authRouter);
app.use('/recipes', recipeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
