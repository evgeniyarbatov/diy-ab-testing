const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.cookie('username', uuidv4(), { maxAge: 900000, httpOnly: true });
    res.render('pages/welcome');
});

app.get('/products', (req, res) => {
    res.render('pages/products');
});

app.get('/confirm', (req, res) => {
    res.render('pages/confirm');
});

app.get('/payment', (req, res) => {
    res.render('pages/payment');
});

app.get('/receipt', (req, res) => {
    res.render('pages/receipt');
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});