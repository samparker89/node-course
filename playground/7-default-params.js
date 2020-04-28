const greeter = (name = "Anonymous", {stock, name} = {}) => {
    console.log('Hello ', name);
    console.log('Hello ', stock);
    console.log('Hello ', name);
};

greeter('Sam', {stock: 10, name: 'Deoderant'});
greeter();