const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

const products = [
    {id: '1', name: 'Product 1', description: 'Some text here', price: '5 SGD' },
    {id: '2', name: 'Product 2', description: 'One more text here', price: '15 SGD' },
    {id: '3', name: 'Product 3', description: 'Another text here', price: '20 SGD' },
]

const payments = [
    {id: '1', name: 'Google Pay'},
    {id: '2', name: 'Visa / MasterCard'},
]

app.get('/', (req, res) => {
    res.cookie('username', uuidv4(), { maxAge: 900000, httpOnly: true });
    res.render('pages/welcome');
});

app.get('/products', (req, res) => {
    res.render('pages/products', {
        products: products,
    });
});

app.post('/confirm', (req, res) => {
    const product = products.find(
        product => product.id === req.body.id
    )
    res.render('pages/confirm', { 
        product: product,
    });
});

app.get('/payment/:id', (req, res) => {
    const product = products.find(
        product => product.id === req.params.id
    )
    res.render('pages/payment', { 
        product: product,
        payments: payments,
    });
});

app.get('/receipt/:id', (req, res) => {
    const product = products.find(
        product => product.id === req.params.id
    )
    res.render('pages/receipt', { 
        product: product,
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});