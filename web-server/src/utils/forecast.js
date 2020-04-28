const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/1eb5271e14e96e85872d4264bb0dd350/' + latitude + ',' + longitude + '?units=si';

    request({url, json: true}, (err, { body } ) => {
        if (err) {
            callback('Unable to connect to weather service', undefined);
        } else if (body.error) {
            callback('Unable to find location');
        }
        else {
            const currently = body.currently;
            callback(undefined, "It is currently " + currently.temperature +
                " degrees celsius outside. There is a " + currently.precipProbability + "% chance of rain.");
        }
    });
};

module.exports = forecast;