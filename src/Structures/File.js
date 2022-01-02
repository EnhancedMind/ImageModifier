const { writeFileSync } = require('fs');

const { getAnswers, getPixelData } = require('../Data/data.js');


function makeFile() {
    let answers = getAnswers();

    writeFileSync(`${answers[0]}.out.txt`, getPixelData(), err => {
        if(err) console.log(err);
    });
}

module.exports = { makeFile }
