const experiments = [
  {
    'feature': 'PrimaryColorButton',
    'control': [{
      'params': {
        'background-color': '#007bff',
        'color': '#ffffff',
        'border-color': '#007bff',
      },
    }],
    'test': [{
      'params': {
        'background-color': '#ff0000',
        'color': '#ffffff',
        'border-color': '#ff0000',
      },
    }],
  },
];

module.exports = experiments;
