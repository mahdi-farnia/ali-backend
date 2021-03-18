const express = require('express'),
  chalk = require('chalk'),
  data = require('./data.json'),
  { extname } = require('path');

const PORT = +(process.argv[3] || 3000),
  hostname = process.argv[2] || 'localhost',
  { length: dataLength } = data;

let transformedJson = [];
for (let i = 0; i < dataLength; i++) {
  transformedJson[i] = { ...data[i] };
  const product = transformedJson[i];
  product.photo = `http://${hostname}:${PORT}/${product.photo}`;
}

const app = express();

app.use(express.static('./drawable'));

app.get('/:name', (req, res) => {
  const { name } = req.params;

  for (let i = 0; i < dataLength; i++) {
    const product = data[i];
    if (product.photo.replace(extname(product.photo), '') === name)
      return res.json(transformedJson[i]);
  }

  // Name Not Found!
  res.sendStatus(404);
});

app.get('/', (req, res) => res.json(transformedJson));

// Not Found!
app.use((req, res) => res.sendStatus(404));

app.listen(PORT, () =>
  console.log(chalk.bgGreen(`Server is running on http://${hostname}:${PORT}/`))
);
