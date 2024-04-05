const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const logger = require('./logger');

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
    const username = uuidv4()
    logger.info({
        userid: username, 
        page: 'welcome',
    })
    res.cookie('username', username, { maxAge: 900000, httpOnly: true });
    res.render('pages/welcome', {
        event: 'welcome',
    });
});

app.get('/products', (req, res) => {
    logger.info({
        userid: req.cookies.username, 
        page: 'products',
    })
    res.render('pages/products', {
        products: products,
        event: 'products',
    });
});

app.post('/confirm', (req, res) => {
    const product = products.find(
        product => product.id === req.body.productId
    )
    logger.info({
        userid: req.cookies.username, 
        product: product,
        page: 'confirm',
    })
    res.render('pages/confirm', { 
        product: product,
        event: 'confirm',
    });
});

app.get('/payment/:productId', (req, res) => {
    const product = products.find(
        product => product.id === req.params.productId
    )
    logger.info({
        userid: req.cookies.username, 
        product: product,
        page: 'payment',
    })
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
    logger.info({
        userid: req.cookies.username, 
        product: product,
        payment: payment,
        page: 'receipt',
    })
    res.render('pages/receipt', { 
        product: product,
        event: 'receipt',
    });
});

app.post('/log', (req, res) => {
    const { elementId, event, action } = req.body;
    logger.info({
        userid: req.cookies.username, 
        event: {
            elementId: elementId,
            event: event,
            action: action,
        },
    })
    res.sendStatus(200);
  });

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});