/* eslint no-process-env:0 */
if (process.env.UT_MODULE && process.env.UT_ENV) {
    const UT_MODULE = process.env.UT_MODULE.replace(/[-/\\]/g, '_') + '_' + process.env.UT_ENV;
    const BUILD_ID = process.env.CI_BUILD_ID || process.env.BUILD_ID;
    const BRANCH_NAME = process.env.BRANCH_NAME;
    const UT_DB_PASS = process.env.UT_DB_PASS;
    process.env[`ut_${UT_MODULE}_db__db__database`] = `impl-${UT_MODULE}-${BRANCH_NAME}-${BUILD_ID}`;
    process.env[`ut_${UT_MODULE}_db__create__password`] = UT_DB_PASS;
    process.env[`ut_${UT_MODULE}_auditdb__db__database`] = `impl-${UT_MODULE}audit-${BRANCH_NAME}-${BUILD_ID}`;
    process.env[`ut_${UT_MODULE}_auditdb__create__password`] = UT_DB_PASS;
    process.env[`ut_${UT_MODULE}_historydb__db__database`] = `impl-${UT_MODULE}history-${BRANCH_NAME}-${BUILD_ID}`;
    process.env[`ut_${UT_MODULE}_historydb__create__password`] = UT_DB_PASS;
    process.env[`ut_${UT_MODULE}_workDir`] = process.cwd() + '/dev';
}
