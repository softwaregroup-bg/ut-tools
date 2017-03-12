/* eslint no-console:0, no-process-env:0 */
const helpers = require('./cmd/helpers');

module.exports = (command) => {
    let args = process.argv.splice(2, process.argv.length);
    switch (args.shift()) {
        case 'status':
            return require('./cmd/status')(args);
        case 'hooks':
            return require('./cmd/hooks')(args);
        case 'update':
            return require('./cmd/update')(args);
        case 'branches':
            return require('./cmd/branches')(args);
        case 'usedev':
            return require('./cmd/usedev')(args);
        default:
            console.log(`Action not found!
Use one of:
    ${helpers.Bold}ut usedev${helpers.Reset} deletes all modules cloned in dev from node_modules
    ${helpers.Bold}ut hooks${helpers.Reset} creates pre-commit hooks for all modules and implementation
    ${helpers.Bold}ut status${helpers.Reset} shows git status for all modules and implementation
    ${helpers.Bold}ut branches${helpers.Reset} shows git branch for all modules and implementation
    ${helpers.Bold}ut update${helpers.Reset} updates all modules and implementation
`);
    }
};
