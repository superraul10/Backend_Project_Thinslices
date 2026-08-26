import express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello from TypeScript Express!');
});

//aici apelez routerul pentru lucruri legate de autentificare (eventual daca termin mai repede sa fac si logout)
app.use('/auth', require('./routes/authRouter'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
