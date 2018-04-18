/* eslint no-console:0, no-process-exit:0 */
const {exec} = require('pkg');
const path = require('path');
const fs = require('fs');

module.exports = () => {
    console.log(process.argv);
    const fileName = path.join(process.cwd(), 'package.json');
    const pkg = require(fileName);
    const output = process.argv[2] || ('bin/' + pkg.name);
    const args = ['--output', output];
    if (!pkg.pkg || !pkg.pkg.targets) {
        args.push('--targets');
        args.push('node8-windows-x64');
    }

    args.push(fileName);

    exec(args)
        .then(() => console.log(output))
        .then(() => fs.writeFileSync('bin/package.json', JSON.stringify({
            name: pkg.name,
            description: pkg.description,
            version: pkg.version,
            publishConfig: pkg.publishConfig,
            author: pkg.author,
            license: pkg.license
        })))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
};
