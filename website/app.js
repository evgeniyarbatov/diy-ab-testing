const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.cookie('username', uuidv4(), { maxAge: 900000, httpOnly: true });
    res.render('products', { title: 'Products' });
});

app.get('/confirm', (req, res) => {
    console.log(req.cookies.username);
    res.render('confirm', { title: 'Confirm' });
});

app.get('/payment', (req, res) => {
    console.log(req.cookies.username);
    res.render('payment', { title: 'Payment' });
});

app.get('/receipt', (req, res) => {
    console.log(req.cookies.username);
    res.cookie('username', '', { maxAge: 0 });
    res.render('receipt', { title: 'Receipt' });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});