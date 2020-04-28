// const square = function (x) {
//     return x * x;
// };

// const square = x => x*x;
//
// console.log(square(3));

const event = {
    guestList: ['Sam', 'Luke', 'John'],
    name: 'Birthday Party',
    printGuestList() {
        console.log("Guest list for " + this.name);

        this.guestList.forEach(guest => console.log(guest) + this.name);
    }
};

event.printGuestList();