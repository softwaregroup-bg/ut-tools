/* eslint no-console:0, no-process-exit:0 */
const versionBump = require('../lib/versionBump');
versionBump()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
