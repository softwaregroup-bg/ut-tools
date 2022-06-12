/* eslint no-process-env:0 */
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const request = require('request');

module.exports = (function() {
    const currentDir = path.resolve('./');
    const devFolder = path.resolve(currentDir, 'dev');
    const nodeModules = path.resolve(currentDir, 'node_modules');
    const utModules = path.resolve(currentDir, 'ut', 'node_modules');
    const Reset = '\x1b[0m';
    const Bold = '\x1B[1m';
    const FgRed = '\x1b[31m';
    const FgGreen = '\x1b[32m';
    const FgYellow = '\x1b[33m';
    const FgPurple = '\x1b[35m';

    const ok = (params) => {
        const icon = params.icon || '🍺  ';
        const status = params.status || 'OK';
        return `${icon}[${FgGreen}${status}${Reset}] ${params.msg}`;
    };
    const error = (params) => {
        const icon = params.icon || '🔥  ';
        return `${icon}[${FgRed}ERROR${Reset}] ${params.msg}`;
    };
    const skip = (params) => {
        const icon = params.icon || '🤘  ';
        return `${icon}[${FgYellow}SKIP${Reset}] ${params.msg}`;
    };
    const warn = (params) => {
        const icon = params.icon || '⚠️  ';
        return `${icon}[${FgPurple}WARNING${Reset}] ${params.msg}`;
    };

    const exists = (path) => {
        return new Promise((resolve, reject) => fs.stat(path, (err, ok) => {
            if (err) {
                reject(err);
            }
            resolve(ok !== undefined);
        }));
    };
    const writeFile = (path, content) => {
        return new Promise((resolve, reject) => fs.writeFile(path, content, (err) => {
            resolve(err === null);
        }));
    };

    const isUt5Directory = () => {
        return new Promise((resolve, reject) => {
            let rejected = 0;
            const countReject = reason => {
                rejected++;
                if (rejected === 3) {
                    reject(reason);
                }
            };
            Promise.resolve().then(exists(devFolder)).then(resolve).catch(countReject);
            Promise.resolve().then(exists(utModules)).then(resolve).catch(countReject);
            Promise.resolve().then(exists(nodeModules)).then(resolve).catch(countReject);
        });
    };

    const devModules = () => {
        return new Promise((resolve, reject) => {
            let count = 0;
            let errCount = 0;
            let folders = [];
            const handleDir = base => (err, files) => {
                count++;
                if (err) {
                    errCount++;
                    if (errCount === 2) {
                        reject(err);
                    }
                }
                if (!err) {
                    folders = folders.concat(files
                        .map(folder => path.join(base, folder))
                        .filter(fullPath => fs.existsSync(path.join(fullPath, '.git')) && fs.statSync(path.join(fullPath, '.git')).isDirectory())
                    );
                }
                if (count === 2) {
                    resolve(folders.sort());
                }
            };
            fs.readdir(devFolder, handleDir(devFolder));
            fs.readdir(utModules, handleDir(utModules));
        });
    };

    const getLatestCIVersion = (module) => {
        return new Promise((resolve, reject) => {
            request(`${process.env.NEXUS_URL}${module}`, function(error, response, body) {
                if (error) reject(error);
                body = JSON.parse(body);
                resolve({
                    name: body.versions[body['dist-tags'].latest].name,
                    latest: body['dist-tags'][process.env.BRANCH]
                });
            });
        });
    };

    const execute = (cmd, args) => {
        return new Promise((resolve, reject) => {
            const ls = spawn(cmd, args);
            const output = [];

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
        getLatestCIVersion,
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
