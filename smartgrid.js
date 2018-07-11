const smartgrid = require('smart-grid');

const settings = {
  outputStyle: 'less',
  columns: 10,
  offset: '10px',
  container: {
    maxWidth: '1610px',
    fields: '30px'
  },
  breakPoints: {
    lg: {
      width: "1920px",
      fields: '30px'
    },
    md: {
      width: "1170px",
      fields: "20px"
    },
    sm: {
      width: "980px",
      fields: "10px"
    },
    xs: {
      width: "480px",
      fields: "5px"
    }
  },
  properties: [
    'justify-content'
  ]
};

smartgrid('./src/assets/styles/partials', settings);