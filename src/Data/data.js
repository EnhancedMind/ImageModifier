
let answers = [];

function setAnswer(index, data) {
    return answers[index] = data;
}
function getAnswers() {
    return answers;
}


let pixelData = '';

function setPixelData(data) {
    return pixelData = data;
}
function getPixelData() {
    return pixelData;
}

module.exports = { setAnswer, getAnswers, setPixelData, getPixelData }
