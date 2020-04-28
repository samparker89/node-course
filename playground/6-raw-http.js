const https = require ('https');

const url = "https://api.darksky.net/forecast/1eb5271e14e96e85872d4264bb0dd350/40,-75?units=si"

const request = https.request(url, (response) => {

    let body = '';

    response.on('data', (chunk) => {
        body += chunk.toString();
    });

    response.on('end', () => {
        const responseBody = JSON.parse(body);
        console.log(responseBody);
    });
});

request.on('error', (err) => {
    console.log(err);
});

request.end();