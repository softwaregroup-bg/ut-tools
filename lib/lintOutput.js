/* eslint no-console:0, no-process-env:0 */
var path = require('path');
var fs = require('fs');
var cli = require('eslint').CLIEngine;

module.exports = function output(outputFile, errors) {
    if (typeof process.env.BUILD_NUMBER !== 'undefined') {
        const output = cli.getFormatter('checkstyle')(errors);
        const filePath = path.resolve(process.cwd(), outputFile);

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
        console.error(cli.getFormatter()(errors));
    }
};
