const { existsSync } = require('fs');
const { createInterface } = require('readline');

const { Image } = require('./Image.js');
const { makeFile } = require('./File.js');
const { setAnswer } = require('../Data/data.js');


function ReadLine() {

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Select file: ', answer0 => {
        if (!existsSync(answer0)) return terminate('The file you want to read does not exist!');
        setAnswer(0, answer0);

        rl.question('How should the image fit?\n    ( cover, contain, fill, inside, outside ) (leave blank for cover)  ', answer1 => {
            if (!['cover', 'contain', 'fill', 'inside', 'outside', ''].includes(answer1)) return terminate(`The only valid options are: ['cover', 'contain', 'fill', 'inside', 'outside', '']`);
            if (answer1 == '') setAnswer(1, 'cover');
            else setAnswer(1, answer1);
            Image();

            rl.question(`Made ${answer0}.output.png and ${answer0}.output_reduced.png as a preview\n    Should I now make the data text file? (leave blank for yes) `, answer2 => {
                if (!['y', 'yes', 'n', 'no', ''].includes(answer2)) return terminate(`The only valid options are: [ 'y', 'yes', 'n', 'no', '' ]`);
                if (['y', 'yes'].includes(answer2) || answer2 == '') makeFile();
                rl.close();

                console.log('Process completed, press any key to continue . . .');
                process.stdin.setRawMode(true);
                process.stdin.resume();
                process.stdin.on('data', process.exit.bind(process, 0));
            });
        });
    });

    function terminate(data) {
        console.log(data);
        rl.close();
        console.log('Press any key to continue . . .');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 1));
    }
}

module.exports = { ReadLine }
