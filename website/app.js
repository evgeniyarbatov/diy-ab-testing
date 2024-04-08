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
  // Store the state of experiment features
  const experiments = Object.entries(req.cookies).filter(
      ([name, value]) => Experiments.getIsFeature(name),
  );

  const extra = {...req.body, ...req.params};

  logger.info({
    username: req.cookies.username,
    url: req.url,
    experiments: experiments.map(([name, group]) => {
      return {group: group, name: name};
    }),
    event: extra.action ?? 'impression',
    extra: extra,
  });

  next();
});

app.get('/', (req, res) => {
  if (req.cookies) {
    for (const cookieName in req.cookies) {
      if (Experiments.getIsFeature(cookieName)) {
        res.clearCookie(cookieName);
      }
    }
  }

  const username = uuidv4();
  res.cookie('username', username, {maxAge: 900000, httpOnly: true});

  res.render('pages/welcome', {
    page: 'welcome',
  });
});

app.get('/products', (req, res) => {
  const group = Experiments.getUserGroup(
      req.cookies,
      Features.SkipConfirmationScreen,
  );
  Experiments.cacheFeatureGroup(Features.SkipConfirmationScreen, group, res);

  res.render('pages/products', {
    products: products,
    page: 'products',
    skipConfirmationScreen: group === 'test',
  });
});

app.post('/confirm', (req, res) => {
  const product = products.find(
      (product) => product.id === req.body.productId,
  );
  res.render('pages/confirm', {
    product: product,
    page: 'confirm',
  });
});

app.post('/payment', (req, res) => {
  res.redirect(`/payment/${req.body.productId}`);
});

app.get('/payment/:productId', (req, res) => {
  const product = products.find(
      (product) => product.id === req.params.productId,
  );
  res.render('pages/payment', {
    product: product,
    payments: payments,
    page: 'payment',
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

app.post('/log', (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
