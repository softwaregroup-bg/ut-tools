/* eslint no-process-env:0 */
if (process.env.UT_MODULE && process.env.UT_ENV) {
    var utmodule = process.env.UT_MODULE + '_' + process.env.UT_ENV;
    process.env['ut_' + utmodule + '_db__db__database'] = 'impl-' + utmodule + '-' + (process.env.CI_BUILD_ID || process.env.BUILD_ID);
    process.env['ut_' + utmodule + '_db__create__password'] = process.env.UT_DB_PASS;
    process.env['ut_' + utmodule + '_workDir'] = process.cwd();
}
