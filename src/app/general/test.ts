const fizzIt = () => {
    for (let i = 1; i < 101; i++) {
        const isFizz = i % 3 === 0;
        const isBuzz = i % 5 === 0;
        let result;

        if (isFizz && isBuzz) {
            result = 'FizzBuzz';
        } else if (isFizz) {
            result = 'Fizz';
        } else if (isBuzz) {
            result = 'Buzz';
        } else {
            result = i;
        }
        console.log(result);
    }
};


fizzIt();
