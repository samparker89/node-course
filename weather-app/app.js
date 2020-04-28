const forecast = require('./utils/forecast.js');
const geocode = require('./utils/geocode.js');

const location = process.argv[2];

if (!location) {
    return console.log('Please provide a location');
}

geocode(location, (err, {latitude, longitude, location}) => {
    if (err) {
        return console.log(err);
    }

    forecast(latitude, longitude, (err, forecastData) => {
        if (err) {
            return console.log(err);
        }

        console.log(location);
        console.log(forecastData);
    });
});