/* eslint no-console:0, no-process-exit:0 */
var childProcess = require('child_process');

function executeCommand(cmd, args) {
    var ret = childProcess.spawnSync(cmd, args, {
        stdio: 'inherit'
    });

    (ret.status !== 0) && process.exit(ret.status);
    if (ret.error) {
        throw ret.error;
    }
}

module.exports = executeCommand;
