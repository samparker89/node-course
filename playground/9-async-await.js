const add = (a, b) => {
    console.log('Doing work')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if ((a < 0) || (b < 0)) {
                return reject('Numbers must be positive')
            }
            resolve(a + b)
        }, 2000)
    })
}

const doWork = async () => {
    const p1 = add(1, 99)
    const p2 = add(-5, 102)

    const result1 = await p1;
    const result2 = await p2;

    return result1 + result2;
}


doWork().then((result) => {
    console.log(result)
}).catch(e => {
    console.log(e)
})