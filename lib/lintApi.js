/* eslint no-process-env:0 */
const exec = require('./exec');
const {resolve} = require('path');

module.exports = function() {
    const ruleset = resolve(__dirname, '..', 'spectral', 'ruleset.yaml');
    const rec = typeof process.env.BUILD_NUMBER !== 'undefined' || true;
    const openapi = exec('"' + process.execPath + '"', [
        require.resolve('@stoplight/spectral-cli/dist'),
        'lint',
        './system/api/**/openapi.json',
        '--ruleset',
        ruleset,
        ...rec ? ['-f', 'stylish', '-f', 'junit', '--output.junit', './.lint/lint-openapi.xml'] : []
    ], {shell: true}, false);
    console.log(''); // eslint-disable-line no-console
    const swagger = exec('"' + process.execPath + '"', [
        require.resolve('@stoplight/spectral-cli/dist'),
        'lint',
        './system/api/**/swagger.json',
        '--ruleset',
        ruleset,
        ...rec ? ['-f', 'stylish', '-f', 'junit', '--output.junit', './.lint/lint-swagger.xml'] : []
    ], {shell: true}, false);
    console.log(''); // eslint-disable-line no-console

    return (openapi === false) || (swagger === false);
};
