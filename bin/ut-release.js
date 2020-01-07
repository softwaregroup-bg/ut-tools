#!/usr/bin/env node
/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
const exec = require('../lib/exec');
const versionBump = require('../lib/versionBump');
const fs = require('fs');
const Convert = require('ansi-to-html');
const convert = new Convert();

const audit = exec('npm', ['audit', '--color', 'always', '--registry', 'https://registry.npmjs.org'], 'pipe', 'stdout');
console.log(audit);
if (fs.existsSync('.lint')) fs.writeFileSync('.lint/audit.html', '<pre style="background-color: black; color: white">\n' + convert.toHtml(audit) + '\n</pre>');

versionBump()
    .then(({tag}) => {
        exec('git', ['push']);
        exec('git', ['push', 'origin', '--tags']);
        if (process.env.npm_package_scripts_doc) exec('npm', ['run', 'doc']);
        if (process.env.npm_package_scripts_compile) exec('npm', ['run', 'compile']);
        return exec('npm', (tag ? ['publish', '--tag', tag] : ['publish']).concat(process.argv.slice(2)));
    })
    .then(() => fs.copyFileSync && fs.copyFileSync('package.json', '.lint/result.json'))
    .catch(function(e) {
        console.error(e);
        process.exit(1);
    });
