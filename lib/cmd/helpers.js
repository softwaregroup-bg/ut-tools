const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

module.exports = (function() {
    const currentDir = path.resolve('./');
    const devFolder = path.resolve(currentDir, 'dev');
    const nodeModules = path.resolve(currentDir, 'node_modules');
    const Reset = '\x1b[0m';
    const Bold = '\x1B[1m';
    const FgRed = '\x1b[31m';
    const FgGreen = '\x1b[32m';
    const FgYellow = '\x1b[33m';
    const FgPurple = '\x1b[35m';

    const ok = (params) => {
        let icon = params.icon || '🍺  ';
        let status = params.status || 'OK';
        return `${icon}[${FgGreen}${status}${Reset}] ${params.msg}`;
    };
    const error = (params) => {
        let icon = params.icon || '🔥  ';
        return `${icon}[${FgRed}ERROR${Reset}] ${params.msg}`;
    };
    const skip = (params) => {
        let icon = params.icon || '🤘  ';
        return `${icon}[${FgYellow}SKIP${Reset}] ${params.msg}`;
    };
    const warn = (params) => {
        let icon = params.icon || '⚠️  ';
        return `${icon}[${FgPurple}WARNING${Reset}] ${params.msg}`;
    };

    const exists = (path) => {
        return new Promise((resolve, reject) => fs.stat(path, (err, ok) => {
            if (err) reject(err);
            resolve(ok !== undefined);
        }));
    };
    const writeFile = (path, content) => {
        return new Promise((resolve, reject) => fs.writeFile(path, content, (err) => {
            resolve(err === null);
        }));
    };

    const isUt5Directory = async () => {
        let devExists = await exists(devFolder);
        let nodeModulesExists = await exists(nodeModules);
        return devExists && nodeModulesExists;
    };

    const devModules = () => {
        return new Promise((resolve, reject) => fs.readdir(devFolder, (err, files) => {
            if (err) reject(err);
            resolve(files.filter(file => fs.statSync(path.join(devFolder, file)).isDirectory()));
        }));
    };

    const execute = (cmd, args) => {
        return new Promise((resolve, reject) => {
            const ls = spawn(cmd, args);
            let output = [];

            ls.stdout.on('data', (data) => {
                output.push(data.toString());
            });

            ls.stderr.on('data', (data) => {
                output.push(data.toString());
            });

            ls.on('close', (code) => {
                if (code === 0) {
                    resolve(output.join(''));
                } else {
                    reject(output.join(''));
                }
            });
        });
    };

    return {
        currentDir,
        devFolder,
        nodeModules,
        ok,
        error,
        skip,
        warn,
        isUt5Directory,
        devModules,
        exists,
        writeFile,
        execute,

        Reset,
        Bold,
        FgRed,
        FgGreen,
        FgYellow,
        FgPurple
    };
}());
