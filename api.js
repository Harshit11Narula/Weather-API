const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe:   'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help' , 'h')
  .argv;

  var encode = encodeURIComponent(argv.address);
  var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encode}`;
  axios.get(geocodeUrl).then((response) =>{
    if(response.data.status === 'ZERO_RESULTS') {
      throw new Error('Unable to find that address');
    }
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/a6ac3fc205da020b6820079a8c30ef87/${lat},${lng}`;
    console.log('Address: ',response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
  }).then((response) => {
    var temperature = response.data.currently.temperature;
    var appTemperature = response.data.currently.apparentTemperature;
    console.log(`It's Currently ${temperature}. It feels like ${appTemperature}`);
  }).catch((e) => {
    if(e.code === 'ENOTFOUND') {
      console.log('unable to connect to API server.');
    } else {
      console.log(e.message);
    }
  });
