/* eslint no-console:0, no-process-env:0 */
const path = require('path');
const fs = require('fs');
const { ESLint } = require('eslint');

module.exports = async function output(outputFile, errors) {
    if (typeof process.env.BUILD_NUMBER !== 'undefined') {
        const output = require('./checkStyleRelative')(errors);
        const filePath = path.resolve(process.cwd(), '.lint', outputFile);
        try {
            fs.mkdirSync(path.resolve(process.cwd(), '.lint'));
        } catch (e) {
            if (e.code !== 'EEXIST') throw e;
        }

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            console.error(`Cannot write to output file path, it is a directory: ${outputFile}`);
            return true;
        }

        try {
            fs.writeFileSync(filePath, output);
        } catch (ex) {
            console.error(`There was a problem writing the output file:\n${ex}`);
            return true;
        }
    } else {
        const eslint = new ESLint();
        const formatter = await eslint.loadFormatter();
        console.error(formatter.format(errors));
    }
};
