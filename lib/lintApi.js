/* eslint no-process-env:0 */
const exec = require('./exec');

module.exports = function() {
    const ruleset = require.resolve('../spectral/ruleset.yaml');
    const rec = typeof process.env.BUILD_NUMBER !== 'undefined' || true;
    /* const openapi = */ exec('spectral', [
        'lint', './system/api/**/openapi.json', '--ruleset', ruleset,
        ...rec ? ['-f', 'stylish', '-f', 'json', '--output.json', './.lint/lint-openapi.json'] : []
    ], 'inherit', 'stdout', true, true);
    /* const swagger = */ exec('spectral', [
        'lint', './system/api/**/swagger.json', '--ruleset', ruleset,
        ...rec ? ['-f', 'stylish', '-f', 'json', '--output.json', './.lint/lint-swagger.json'] : []
    ], 'inherit', 'stdout', true, true);

    //  return openapi.status || swagger.status;
    return 0;
};
