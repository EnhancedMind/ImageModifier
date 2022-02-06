const bits = 5;  //put wanted number of bits here

console.log('Process start!');

let px = 255/(2**bits - 1);
let number = px;
let array = [];
array[0] = 0;
process.stdout.write('[ 0');
for (let i = 1; i <= (2**bits - 1); i++) {
    process.stdout.write(`, ${Math.round(number)}`);
    array[i] = Math.round(number);
    number = number + px;
    
}
process.stdout.write(' ]\n');
console.log(array);