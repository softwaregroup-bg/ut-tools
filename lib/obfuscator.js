const JavaScriptObfuscator = require('javascript-obfuscator');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const cwd = process.cwd();
const obFileName = './.obfuscate';

// checks for file named "obfuscate" with new line separated records, each record is a glob pattern for matching js files which should be obfuscated
module.exports = {
    obfuscate: function() {
        if (fs.existsSync(path.join(cwd, obFileName))) { // check for file
            fs
                .readFileSync(path.join(cwd, obFileName)) // read file
                .toString()
                .split('\n') // split it by line
                .map((globPattern) => {
                    return glob.sync(globPattern, {})
                        .map((fn) => path.join(cwd, fn)); // make file paths absolute
                })
                .reduce((accum, cur) => accum.concat(cur), []) // flatten structure
                .map((fn) => (fs.writeFileSync(
                    fn,
                    JavaScriptObfuscator.obfuscate(fs.readFileSync(fn).toString()).getObfuscatedCode()
                )));
        }
    }
};
