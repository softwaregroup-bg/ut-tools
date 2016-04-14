/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
var childProcess = require('child_process');

function executeCommand(cmd, args) {
    var ret;

    if (process.platform === 'win32') {
        ret = childProcess.spawnSync(process.env.comspec || 'cmd.exe', ['/s', '/c', cmd].concat(args), {
            stdio: 'inherit'
        });
    } else {
        ret = childProcess.spawnSync(cmd, args, {
            stdio: 'inherit'
        });
    }

    (ret.status !== 0) && process.exit(ret.status);
    if (ret.error) {
        throw ret.error;
    }
}

module.exports = executeCommand;
