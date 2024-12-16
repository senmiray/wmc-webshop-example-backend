const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simulierte Datenbank
let products = [
  { id: 1, name: 'Product A', price: 100, description: 'Description of Product A' },
  { id: 2, name: 'Product B', price: 200, description: 'Description of Product B' },
  { id: 3, name: 'Product C', price: 300, description: 'Description of Product C' },
];

// Produkte abrufen (mit Filter und Suche)
app.get('/api/products', (req, res) => {
  const { minPrice, maxPrice, search } = req.query;
  let filteredProducts = products;

  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => product.price >= Number(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.price <= Number(maxPrice));
  }
  if (search) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filteredProducts);
});

// Neues Produkt erstellen
app.post('/api/products', (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price || !description) {
    return res.status(400).send({ message: 'All fields are required.' });
  }

  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    name,
    price: Number(price),
    description,
  };

  products.push(newProduct);
  res.status(201).send(newProduct);
});

// Produkt löschen
app.delete('/api/products/:id', (req, res) => {
  const productId = Number(req.params.id);
  const index = products.findIndex(product => product.id === productId);

  if (index !== -1) {
    products.splice(index, 1);
    res.status(200).send({ message: 'Product deleted successfully!' });
  } else {
    res.status(404).send({ message: 'Product not found.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
