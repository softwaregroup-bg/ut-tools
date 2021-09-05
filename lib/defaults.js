const fs = require('fs');
module.exports = fs.existsSync('lerna.json') ? {
    testFiles: [
    ]
} : {
    testFiles: [
        '"--test-regex=(\\.(tests?|spec)|^\\/?tests?)\\.([mc]js|[jt]sx?)$"'
    ]
};
