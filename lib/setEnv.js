/* eslint no-process-env:0 */
var utmodule = process.env['UT_MODULE'];
process.env[utmodule + '_db__db__database'] = 'ut-' + utmodule + '-' + (process.env['CI_BUILD_ID'] || process.env['BUILD_ID']);
process.env[utmodule + '_db__create__password'] = process.env['UT_DB_PASS'];
