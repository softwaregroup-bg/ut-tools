var fs = require('fs');
module.exports = fs.existsSync('lerna.json') ? {
    testFiles: [
        '"packages/*/!(node_modules|tap-snapshots)/**/*.test.js"',
        '"packages/*/*.test.js"'
    ]
} : {
    testFiles: ['"!(node_modules|tap-snapshots)/**/*.test.js"']
};
