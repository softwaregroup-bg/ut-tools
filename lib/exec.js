/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
var childProcess = require('child_process');

function executeCommand(cmd, args, opt) {
    var ret;

    if (process.platform === 'win32') {
        ret = childProcess.spawnSync(process.env.comspec || 'cmd.exe', ['/s', '/c', cmd].concat(args), {
            stdio: opt || 'inherit'
        });
    } else {
        ret = childProcess.spawnSync(cmd, args, {
            stdio: opt || 'inherit'
        });
    }

    if (ret.error) {
        console.log(cmd, args.join(' '), '=>');
        console.error(ret.error);
        process.exit(1);
    }

    if (ret.status !== 0) {
        console.log(cmd, args.join(' '), '=>', ret.status);
        process.exit(ret.status);
    }

    return ret.stdout && ret.stdout.toString().trim();
}

module.exports = executeCommand;
