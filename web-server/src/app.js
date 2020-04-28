const path = require('path');

const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for express config
const publicDirectory = path.join(__dirname, '..' , 'public');
const viewsPath = path.join(__dirname, '..', 'templates', 'views');
const partialsPath = path.join(__dirname, '..', 'templates', 'partials')

// Express expects all views to live in views folder
// hbs is the node handlebars plugin for express
// If we do not want to use views folder, we can redefine it here
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectory));

app.get('', (req, res) => {
    res.render('index', {
        title: "Weather",
        name: "Sam Parker"
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About me",
        name: "Sam Parker"
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help",
        message: "This is a help message",
        name: "Sam Parker"
    });
});

app.get('/weather', (req, res) => {
    const location = req.query.location;

    if (!location) {
        return res.send({
            err: "Please provide a location"
        });
    }

    geocode(location, (err, {latitude, longitude, location} = {}) => {
        if (err) {
            return res.send( { err });
        }

        forecast(latitude, longitude, (err, forecastData) => {
            if (err) {
                return res.send( { err } );
            }

            res.send({
                forecast: forecastData,
                location: location
            });
        });
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: "Not found",
        message: "Help article not found",
        name: "Sam Parker"
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: "Page not found",
        message: "Not found",
        name: "Sam Parker"
    });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});