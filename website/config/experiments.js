const experiments = [
  {
    feature: 'PrimaryButtonColor',
    control: 'blue',
    test: 'red',
  },
  {
    feature: 'DefaultSelectedProduct',
    control: 'random',
    test: 'low-price',
  },
  {
    feature: 'SkipConfirmationScreen',
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
