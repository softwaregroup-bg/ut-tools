/* eslint no-console:0 */

const exec = require('./exec');
const fs = require('fs');
const Convert = require('ansi-to-html');
const convert = new Convert();

module.exports = () => {
    const audit = exec('npm', ['audit', '--color', 'always', '--registry', 'https://registry.npmjs.org'], 'pipe', 'stdout');
    console.log(audit);
    if (fs.existsSync('.lint')) fs.writeFileSync('.lint/audit.html', '<pre style="background-color: black; color: white">\n' + convert.toHtml(audit) + '\n</pre>');
};
