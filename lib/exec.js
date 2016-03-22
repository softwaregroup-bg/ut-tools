/* eslint no-console:0, no-process-exit:0 */
var childProcess = require('child_process');

function executeCommand(cmd, message) {
    message && console.log(message);
    try {
        childProcess.execSync(cmd, {
            stdio: [0, 1, 2]
        });
    } catch (err) {
        console.error(err.message || err);
        process.exit(1);
    }
}

module.exports = executeCommand;
