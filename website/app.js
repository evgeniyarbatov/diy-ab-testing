express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const {v4: uuidv4} = require('uuid');

const {getLogger} = require('./logger');
const Experiments = require('./experiments');

const Features = require('./config/features.js');
const products = require('./config/products');
const payments = require('./config/payments');

const app = express();
const logger = getLogger('logs/app.log');

const PORT = 8080;

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
  if (req.url == '/') {
    if (req.cookies) {
      res.clearCookie('username');
      for (const cookieName in req.cookies) {
        if (Experiments.getIsFeature(cookieName)) {
          res.clearCookie(cookieName);
        }
      }
    }
  }

  const experiments = Object.entries(req.cookies).filter(
      ([name, value]) => Experiments.getIsFeature(name),
  );

  logger.info({
    username: req.cookies.username,
    url: req.url,
    experiments: experiments.map(([name, group]) => {
      return {group: group, name: name};
    }),
    event: 'impression',
    page: req.url.split('/')[1],
    extra: req.body,
  });

  next();
});

app.get('/', (req, res) => {
  const username = uuidv4();
  res.cookie('username', username, {maxAge: 900000, httpOnly: true});

  res.render('pages/welcome', {
    page: 'welcome',
  });
});

app.get('/products', (req, res) => {
  const skipConfirmation = Experiments.getIsUserInTestGroup(
      req.cookies,
      Features.SkipConfirmationScreen,
      res,
  );

  const cheapestProductSelected = Experiments.getIsUserInTestGroup(
      req.cookies,
      Features.DefaultSelectedProduct,
      res,
  );
  if (cheapestProductSelected) {
    products.sort((a, b) => a.price - b.price);
  } else {
    products.sort((a, b) => Math.random() - 0.5);
  }

  res.render('pages/products', {
    products: products,
    page: 'products',
    skipConfirmationScreen: skipConfirmation,
  });
});

app.post('/confirm', (req, res) => {
  const cancelToPreviousScreen = Experiments.getIsUserInTestGroup(
      req.cookies,
      Features.CancelToPreviousScreen,
      res,
  );

  const product = products.find(
      (product) => product.id === req.body.productId,
  );
  res.render('pages/confirm', {
    product: product,
    page: 'confirm',
    cancelLink: cancelToPreviousScreen ?
      'javascript:history.back()' :
      '/',
  });
});

app.post('/payment', (req, res) => {
  res.redirect(`/payment/${req.body.productId}`);
});

app.get('/payment/:productId', (req, res) => {
  const cancelToPreviousScreen = Experiments.getIsUserInTestGroup(
      req.cookies,
      Features.CancelToPreviousScreen,
      res,
  );

  const product = products.find(
      (product) => product.id === req.params.productId,
  );
  res.render('pages/payment', {
    product: product,
    payments: payments,
    page: 'payment',
    cancelLink: cancelToPreviousScreen ?
      'javascript:history.back()' :
      '/',
  });
});

app.post('/receipt/:productId', (req, res) => {
  const product = products.find(
      (product) => product.id === req.params.productId,
  );
  const payment = payments.find(
      (payment) => payment.id === req.body.paymentId,
  );
  res.render('pages/receipt', {
    product: product,
    payment: payment,
    page: 'receipt',
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
