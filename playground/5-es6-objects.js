// Object property shorthand

const name = 'Sam';
const userAge = 30;

const user = {
    name,
    age: userAge,
    location: 'Blackpool'
};

console.log(user);

// Object destructuring

const product = {
    label: 'Red notebook',
    price: 3,
    stock: 201,
    salePrice: undefined,
    rating: 10
};

// const label = product.label;
// const stock = product.stock;

// Shorthand to extract properties from an object
// Normal name, rename the property, set a default value
// const {stock, label:productLabel, rating = 10} = product;
//
// console.log(stock);
// console.log(productLabel);
// console.log(rating);

const transaction = (transactionType, { label, stock } = {}) => {
    console.log(transactionType, label, stock);
};

transaction('order', product);
transaction('order', undefined);