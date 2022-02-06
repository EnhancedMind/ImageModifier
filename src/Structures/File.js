const { writeFileSync, unlinkSync, existsSync } = require('fs');

const { getAnswers, getPixelData } = require('../Data/data.js');


function makeFile() {
    let answers = getAnswers();

    writeFileSync(`${answers[0]}.out.txt`, getPixelData(), err => {
        if (err) console.log(err);
    });
}

function delFiles() {
    let answers = getAnswers();

    if (existsSync(`${answers[0]}.output.png`)) {
        unlinkSync(`${answers[0]}.output.png`, err => {
            if (err) console.log(err);
        });
    }
    else console.log(`${answers[0]}.output.png does not exist, skipping...`);
    if (existsSync(`${answers[0]}.output_reduced.png`)) {
        unlinkSync(`${answers[0]}.output_reduced.png`, err => {
            if (err) console.log(err);
        });
    }
    else console.log(`${answers[0]}.output_reduced.png does not exist, skipping...`);
}

module.exports = { makeFile, delFiles }
