/* eslint no-console:0, no-process-exit:0, no-process-env:0 */
const childProcess = require('child_process');

function executeCommand(cmd, args, opt, exit, trim) {
    let ret;
    const options = {stdio: 'inherit'};

    if (opt && typeof opt === 'string') {
        options.stdio = opt;
    } else if (typeof opt === 'object') {
        Object.assign(options, opt);
    }

    if (process.platform === 'win32') {
        ret = childProcess.spawnSync(cmd, args, {...options, shell: true});
    } else {
        ret = childProcess.spawnSync(cmd, args, options);
    }

    if (ret.error) {
        ret.stderr && console.error(ret.stderr.toString().trim());
        console.error(cmd, args.join(' '), '=>');
        console.error(ret.error);
        if (exit === false) { return false; }
        if (exit !== 'stdout') process.exit(1);
    } else if (ret.status !== 0) {
        ret.stderr && console.error(ret.stderr.toString().trim());
        console.error(cmd, args.join(' '), '=>', ret.status);
        if (exit === false) { return false; }
        if (exit !== 'stdout') process.exit(1);
    }

    if (trim === false) {
        return ret.stdout && ret.stdout.toString();
    } else {
        return ret.stdout && ret.stdout.toString().trim();
    }
}

module.exports = executeCommand;
