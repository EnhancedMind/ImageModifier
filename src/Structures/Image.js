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
    
    // 2bit
    const reducedPixels = [ 0, 85, 170, 255 ]; //2bit
    // 3bit
    //const reducedPixels = [ 0, 36, 73, 109, 146, 182, 219, 255]; //3bit
    // 4bit
    //const reducedPixels = [ 0, 17, 34, 51, 68, 85, 102, 119, 136, 153, 170, 187, 204, 221, 238, 255 ]; //4bit
    // 5bit
    //const reducedPixels = [ 0, 8, 16, 25, 33, 41, 49, 58, 66, 74, 82, 90, 99, 107, 115, 123, 132, 140, 148, 156, 165, 173, 181, 189, 197, 206, 214, 222, 230, 239, 247, 255 ]; //5bit
    
    for (let i = 0; i < pixelArray.length; i++) {
        pixelArray[i] = reducedPixels.reduce((prev, curr) => {
            return (Math.abs(curr - pixelArray[i]) < Math.abs(prev - pixelArray[i]) ? curr : prev);
        });
        reducedPixelArray[i] = pixelArray[i] / reducedPixels[1];
    }

    const { width, height, channels } = info;
    await sharp(pixelArray, { raw: { width, height, channels } })
        .toFile(`${answers[0]}.output_reduced.png`);


    if (reducedPixelArray.length != 22500) {
        console.log('\nSomething went wrong! (reducedPixelArray.length != 22500)\nPress any key to continue . . .');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 1));
    }

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
    for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
            if (x < 100 && y < 75) {
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
