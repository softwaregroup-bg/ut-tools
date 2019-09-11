var fs = require('fs');
module.exports = fs.existsSync('lerna.json') ? {
    testFiles: [
    ]
} : {
    testFiles: ['"!(node_modules|tap-snapshots)/**/*.test.js"']
};
