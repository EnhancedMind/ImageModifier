const sharp = require('sharp');

const { getAnswers, setPixelData } = require('../Data/data.js');


async function Image() {
    let answers = getAnswers();

    await sharp(answers[0])
        .resize({
            width: 100,
            height: 75,
            fit: answers[1],
        })
        .toFormat('png')
        .toFile(`${answers[0]}.output.png`);

    const { data, info } = await sharp(`${answers[0]}.output.png`)
        .raw()
        .toBuffer({ resolveWithObject: true });

    const pixelArray = new Uint8ClampedArray(data.buffer);
    let reducedPixelArray = [];
    
    const reducedPixels = [ 0, 85, 170, 255 ];
    for (let i = 0; i < pixelArray.length; i++) {
        pixelArray[i] = reducedPixels.reduce((prev, curr) => {
            return (Math.abs(curr - pixelArray[i]) < Math.abs(prev - pixelArray[i]) ? curr : prev);
        });
        reducedPixelArray[i] = pixelArray[i] / 85;
    }

    const { width, height, channels } = info;
    await sharp(pixelArray, { raw: { width, height, channels } })
        .toFile(`${answers[0]}.output_reduced.png`);


    if (reducedPixelArray.length != 22500) throw new Error('Something went wrong! (reducedPixelArray.length != 22500)');

    let reducedPixelDataArray = [];
    
    let k = 0;
    for (let i = 0; i < reducedPixelArray.length; i += 3) {
        let RGB = ( (reducedPixelArray[i] << 4) + (reducedPixelArray[i + 1] << 2) + (reducedPixelArray[i + 2]) ).toString(16);
        if (RGB.length == 1) reducedPixelDataArray[k] = `0x0${RGB}, `;
        else reducedPixelDataArray[k] = `0x${RGB}, `;
        k++
    }

    let reducedPixelData = '';

    let l = 0;
    let m = 0;
    for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 128; j++) {
            if (j < 100 && i < 75) {
                reducedPixelData = reducedPixelData.concat(reducedPixelDataArray[l]);
                l++
            }
            else reducedPixelData = reducedPixelData.concat('0x00, ');

            if ((m + 1) % 8 == 0 && (m + 1) % 16 != 0) reducedPixelData = reducedPixelData.concat('   ');
            if ((m + 1) % 16 == 0) reducedPixelData = reducedPixelData.concat('\n');
            m++
        }
    }

    setPixelData(reducedPixelData);
}

module.exports = { Image }
