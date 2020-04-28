const request = require('request');

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address +
        '.json?access_token=pk.eyJ1Ijoic2FtcGFya2VyODkiLCJhIjoiY2s3d2EyNzU4MDAycTNmbnlqdGV6bmRtdiJ9.oy3RqoHqGL4xZSNByQn3KA';

    request({ url: url, json: true}, (err, { body } ) => {
        if (err) {
            callback('Unable to connect to location services', undefined);
        } else if (!body.features || body.features.length === 0) {
            callback('Unable to find location of ' + address + '. Try another search', undefined);
        } else {
            const data = body.features[0];
            callback(undefined, {
                latitude: data.center[1],
                longitude: data.center[0],
                location: data.place_name
            })
        }
    });
};

module.exports = geocode;