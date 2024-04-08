const Features = require('./features.js');

const experiments = [
  {
    feature: 'PrimaryButtonColor',
    control: 'blue',
    test: 'red',
  },
  {
    feature: 'DefaultSelectedProduct',
    control: 'random',
    test: 'price',
  },
  {
    feature: Features.SkipConfirmationScreen,
    control: 'false',
    test: 'true',
  },
  {
    feature: 'CancelToPreviousScreen',
    control: 'false',
    test: 'true',
  },
  {
    feature: 'HighlightCheapestProduct',
    control: 'false',
    test: 'true',
  },
  {
    feature: 'RandomiseProducts',
    control: 'false',
    test: 'true',
  },
];

module.exports = experiments;
