const express = require('express');
const fs = require('fs');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const path = require('path');
const { v4: uuidv4 } = require('uuid');

const logger = require('./logger');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

const expriments = JSON.parse(
    fs.readFileSync('expriments.json', 'utf8')
);

const products = [
    {id: '1', name: 'Product 1', description: 'Some text here', price: '5 SGD' },
    {id: '2', name: 'Product 2', description: 'One more text here', price: '15 SGD' },
    {id: '3', name: 'Product 3', description: 'Another text here', price: '20 SGD' },
]

const payments = [
    {id: '1', name: 'Google Pay'},
    {id: '2', name: 'Visa / MasterCard'},
]

app.use((req, res, next) => {
    logger.info({
        username: req.cookies.username, 
        url: req.url,
        extra: { ...req.body, ...req.params },
    })

    next();
  });

app.get('/', (req, res) => {
    res.cookie('username', uuidv4(), { maxAge: 900000, httpOnly: true });
    res.render('pages/welcome', {
        event: 'welcome',
    });
});

app.get('/products', (req, res) => {
    res.render('pages/products', {
        products: products,
        event: 'products',
    });
});

app.post('/confirm', (req, res) => {
    const product = products.find(
        product => product.id === req.body.productId
    )
    res.render('pages/confirm', { 
        product: product,
        event: 'confirm',
    });
});

app.get('/payment/:productId', (req, res) => {
    const product = products.find(
        product => product.id === req.params.productId
    )
    res.render('pages/payment', { 
        product: product,
        payments: payments,
        event: 'payment',
    });
});

app.post('/receipt/:productId', (req, res) => {
    const product = products.find(
        product => product.id === req.params.productId
    )
    const payment = payments.find(
        payment => payment.id === req.body.paymentId
    )
    res.render('pages/receipt', { 
        product: product,
        event: 'receipt',
    });
});

app.post('/log', (req, res) => {
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});