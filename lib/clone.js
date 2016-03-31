/* eslint no-console:0, no-process-env:0 */
'use strict';

const meow = require('meow');
const gitlab = require('./gitlab');
const fs = require('fs');
const Git = require('nodegit'); // eslint-disable-line ut-lint/exists
const path = require('path');
const ds = path.sep;

const clone = meow(`
    Usage
      $ ut5 clone [impl]

    Options
      -a, --anonymous Anonymous, wil not allow push

    Examples
      $ ut5 clone --anonymous
`, {
    alias: {
        a: 'anonymous'
    }
});

function gitClone(projects, rootDir, cloneOpts) {
    var project;
    var dir = rootDir;
    if (projects.ut5repo) {
        project = projects.ut5repo.pop();
    } else if (projects.impl.length) {
        project = projects.impl.pop();
        dir = rootDir + ds + 'ut' + ds + 'node_modules' + ds + project.name;
    } else {
        project = projects.ut5.shift();
        dir = rootDir + ds + 'ut' + ds + 'node_modules' + ds + project.name;
    }
    console.info('Cloning project', project.name);
    Git.Clone(project.ssh_url_to_repo, dir, cloneOpts).then(function() {
        if (projects.ut5repo) {
            fs.mkdirSync(dir + ds + 'ut');
            fs.mkdirSync(dir + ds + 'ut' + ds + 'node_modules');
            delete projects.ut5repo;
        }

        if (projects.ut5.length) {
            gitClone(projects, rootDir, cloneOpts);
        }
    }, function(err) {
        console.error('err', err);
    });
}

module.exports = function() {
    var allProjects = gitlab.projects();
    var projects = {
        ut5repo: allProjects.filter(function(project) {
            return project.namespace.name === 'ut5' && project.name === 'ut5';
        }),
        ut5: allProjects.filter(function(project) {
            return project.namespace.name === 'ut5' && project.name !== 'ut5';
        }),
        impl: allProjects.filter(function(project) {
            return clone.input[1] && clone.input[1] === project.name;
        })
    };

    var cloneOpts = {
        fetchOpts: {
            callbacks: {
                credentials: function(url, userName) {
                    var sshDirectory = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
                    if (clone.flags.anonymous) {
                        return Git.Cred.sshKeyNew(userName, path.resolve(__dirname, '..', 'ssh', 'anonymous_id_rsa.pub'),
                            path.resolve(__dirname, '..', 'ssh', 'anonymous_id_rsa'), '');
                    }
                    return Git.Cred.sshKeyNew(userName, path.resolve(sshDirectory, '.ssh', 'id_rsa.pub'), path.resolve(sshDirectory, '.ssh', 'id_rsa'), '');
                }
            }
        }
    };

    gitClone(projects, process.cwd(), cloneOpts);
};
