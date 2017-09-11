/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
var childProcess = require('child_process');

function executeCommand(cmd, args, opt, exit, trim) {
    var ret;
    var options = {stdio: 'inherit'};

    if (opt && typeof opt === 'string') {
        options.stdio = opt;
    } else if (typeof opt === 'object') {
        Object.assign(options, opt);
    }

    if (process.platform === 'win32') {
        ret = childProcess.spawnSync(process.env.comspec || 'cmd.exe', ['/s', '/c', cmd].concat(args), options);
    } else {
        ret = childProcess.spawnSync(cmd, args, options);
    }

    if (ret.error) {
        ret.stderr && console.error(ret.stderr.toString().trim());
        console.error(cmd, args.join(' '), '=>');
        console.error(ret.error);
        if (exit === false) { return false; }
        process.exit(1);
    }

    if (ret.status !== 0) {
        ret.stderr && console.error(ret.stderr.toString().trim());
        console.error(cmd, args.join(' '), '=>', ret.status);
        if (exit === false) { return false; }
        process.exit(ret.status);
    }

    if (trim === false) {
        return ret.stdout && ret.stdout.toString();
    } else {
        return ret.stdout && ret.stdout.toString().trim();
    }
}

module.exports = executeCommand;
