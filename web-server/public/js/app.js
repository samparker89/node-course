console.log('Client side javascript file is loaded');

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const errorMessage = document.querySelector('#error');
const forecastMessage = document.querySelector('#forecast');

weatherForm.addEventListener('submit', (e) => {
    // Prevent default behavior. Which for a form is to refresh page
    e.preventDefault();

    forecastMessage.textContent = 'Loading...';
    errorMessage.textContent = '';

    fetch('http://localhost:3000/weather?location=' + search.value).then((response) => {
        response.json().then(data => {
            if (data.err) {
                forecastMessage.textContent = '';
                return errorMessage.textContent = data.err;
            }

            forecastMessage.textContent = data.location + '\n' + data.forecast;
        });
    });
});