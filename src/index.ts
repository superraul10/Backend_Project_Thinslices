import express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello from TypeScript Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
