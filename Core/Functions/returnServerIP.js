const { lookup } = require('geoip-country');

function isEmpty() {
  const configFile = process.env.locations;
  return Object.keys(configFile).length === 0;
}

module.exports = async function (request) {
  const IP = request.ip;
  const IP_DATA = lookup(IP);
  let locations;

  if (IP === '127.0.0.1')
    return (this.server = {
      DOMAIN: 'https://example.com',
      COUNTRY: 'Localhost',
    });

  if (isEmpty() | !process.env.locations) {
    console.log(
      '[ MISCONFIG ]',
      "Please change the locatons Object in the .env file.\nExample: locations={ GB: 'YOUR_SERVER_DOMAIN', US: 'YOUR_SERVER_DOMAIN' }"
    ); // Checks if the config locations is empty
    locations = {
      GB: 'https://cdn.gb.example.com',
      US: 'https://cdn.us.example.com',
      SG: 'https://cdn.sg.example.com',
      GE: 'https://cdn.ge.example.com',
      TW: 'https://cdn.tw.example.com',
    }; // Example locations for testing
  } else {
    console.log('[ INFO ]', 'Detected Server Locations in Config File.');
    locations = config.locations;
  }

  class data {
    constructor() {
      Object.keys(locations).forEach((country) => {
        const domain = locations[country];

        if (!IP_DATA)
          return (this.server = {
            DOMAIN: config.defaultServer,
            COUNTRY: country,
          }); // If No IP Data For That Country Use Default Server

        if (IP_DATA.country === country) {
          return (this.server = {
            DOMAIN: domain,
            COUNTRY: country,
          });
        }
      });
    }
  }

  return new data();
};
