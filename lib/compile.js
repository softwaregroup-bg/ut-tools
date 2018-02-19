/* eslint no-console:0, no-process-exit:0 */
const {exec} = require('pkg');
const path = require('path');

module.exports = () => {
    console.log(process.argv);
    const fileName = path.join(process.cwd(), 'package.json');
    const pkg = require(fileName);
    const output = process.argv[2] || (pkg.name + '@' + pkg.version);
    const args = ['--output', output];
    if (!pkg.pkg || !pkg.pkg.targets) {
        args.push('--targets');
        args.push('node8-windows-x64');
    }

    args.push(fileName);

    exec(args)
        .then(() => console.log(output))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
};
