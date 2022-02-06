const { existsSync } = require('fs');
const { createInterface } = require('readline');

const pjson = require('../../package.json');

const { Image } = require('./Image.js');
const { makeFile, delFiles } = require('./File.js');
const { setAnswer } = require('../Data/data.js');


function ReadLine() {

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log(`This application comes from a GitHub project EnhancedMind/ImageModifier (https://github.com/EnhancedMind/ImageModifier).\nThe use is possible for free while keeping the credits.\nMade by EnhancedMind\nVersion ${pjson.version}\n`);

    rl.question('Select file: ', answer0 => {
        if (!existsSync(answer0)) return terminate('The file you want to read does not exist!');
        setAnswer(0, answer0);

        rl.question('How should the image fit?\n    ( cover, contain, fill ) (leave blank for cover)  ', answer1 => {
            answer1 = answer1.toLowerCase();
            if (!['cover', 'contain', 'fill', ''].includes(answer1)) return terminate(`The only valid options are: ['cover', 'contain', 'fill', '']`);
            if (answer1 == '') setAnswer(1, 'cover');
            else setAnswer(1, answer1);
            Image();

            rl.question(`Made ${answer0}.output.png and ${answer0}.output_reduced.png as a preview\n    Should I now make the data text file? (leave blank for yes) `, answer2 => {
                answer2 = answer2.toLowerCase();
                if (!['y', 'yes', 'n', 'no', ''].includes(answer2)) return terminate(`The only valid options are: [ 'y', 'yes', 'n', 'no', '' ]`);
                if (['y', 'yes', ''].includes(answer2)) makeFile();

                rl.question('Should I now delete the preview images? (leave blank for yes) ', answer3 => {
                    answer3 = answer3.toLowerCase();
                    if (!['y', 'yes', 'n', 'no', ''].includes(answer3)) return terminate(`The only valid options are: [ 'y', 'yes', 'n', 'no', '' ]`);
                    if (['y', 'yes', ''].includes(answer3)) delFiles();
                    
                    rl.close();
                    console.log('Process completed, press any key to continue . . .');
                    process.stdin.setRawMode(true);
                    process.stdin.resume();
                    process.stdin.on('data', process.exit.bind(process, 0));
                });
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
