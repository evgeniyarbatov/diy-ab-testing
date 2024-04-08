const Features = require('./features.js');

const experiments = [
  {
    feature: Features.DefaultSelectedProduct,
    control: 'random',
    test: 'price',
  },
  {
    feature: Features.SkipConfirmationScreen,
    control: 'false',
    test: 'true',
  },
  {
    feature: Features.CancelToPreviousScreen,
    control: 'false',
    test: 'true',
  },
];

module.exports = experiments;
