#!/usr/bin/env node
/* eslint no-process-exit:0 */
(async() => {
    try {
        if (await (require('../lib/lintJS')())) process.exit(1);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        process.exit(1);
    }
})();
