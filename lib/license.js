/* eslint no-console:0, no-process-exit:0 */
const exec = require('./exec');
module.exports = () => {
    exec('ut-run', ['license',
        '--',
        '--toolsUrl', process.env.IMPL_TOOLS_URL,
        '--licenseUsername', process.env.IMPL_TOOLS_LICENSE_USR,
        '--licensePassword', process.env.IMPL_TOOLS_LICENSE_PSW,
        "--projectName", process.env.UT_MODULE,
        "--repository", process.env.GIT_URL
    ]);
};
