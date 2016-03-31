'use strict';

var fs = require('fs-plus');
var path = require('path');
var execFileSync = require('child_process').execFileSync;
var resolve = require('resolve');
var findup = require('findup-sync');
var isBuiltInModule = require('is-builtin-module');

function getCurrentFilePath(context) {
    let filename = context.getFilename();
    if (!fs.isAbsolute(filename)) {
        filename = path.join(process.cwd(), filename);
    }

    return path.dirname(filename);
}

const webpackConfigCache = {};

function getWebpackConfig(fromDir) {
    const pathname = path.resolve(fromDir);
    if (webpackConfigCache[pathname]) {
        return webpackConfigCache[pathname];
    }

    if (!fs.existsSync(pathname)) {
        throw new Error(`Webpack config does not exists at ${pathname}.`);
    }

    const webpackConfigLoadCode = [
        'try {',
        `  var config = JSON.stringify(require('${pathname}'));`,
        '  console.log(config);',
        '} catch (e) {',
        '  console.log(\'{ "parseError": \' + JSON.stringify(e.message) + \' }\');',
        '}'
    ].join('');

    let result = execFileSync(process.argv[0], ['-e', webpackConfigLoadCode]);
    result = result.toString().trim();

    if (!result) {
        throw new Error(`Webpack config is empty at ${pathname}.`);
    }

    result = JSON.parse(result);
    if (result.parseError) {
        throw new Error(`Cannot load Webpack config: ${result.parseError}`);
    }

    webpackConfigCache[pathname] = result;

    return result;
}

function getWebpackAliases(webpackConfigPath) {
    const webpackConfig = getWebpackConfig(webpackConfigPath);

    let alias = {};
    if (typeof webpackConfig.resolve === 'object') {
        if (typeof webpackConfig.resolve.alias === 'object') {
            alias = webpackConfig.resolve.alias;
        }
    }

    return alias;
}

function testModulePath(value, fileDir, aliases, extensions, context) {
    aliases = aliases || {};
    extensions = extensions || [];

    if (isBuiltInModule(value)) {
        return;
    }

    if (aliases[value] !== undefined) {
        value = aliases[value];
    } else {
        for (const key of Object.keys(aliases)) {
            if (value.startsWith(`${key}/`)) {
                value = value.replace(`${key}/`, `${aliases[key]}/`);
                break;
            }
        }
    }

    var pkg = getLocalPackageJson(context.getFilename());
    if (pkg && pkg.peerDependencies && pkg.peerDependencies[getDepNameFromRequirePath(value)]) { // ignore missing dependencies that are peers
        return;
    }

    try {
        resolve.sync(value, {
            basedir: fileDir,
            extensions
        });
    } catch (e) {
        return e.message;
    }
}

function testRequirePath(fileName, node, context, config) {
    for (let value of fileName.split('!')) {
        const fileDir = getCurrentFilePath(context);
        if (!fileDir) {
            continue;
        }

        try {
            let result = testModulePath(value, fileDir, config.aliases, config.extensions, context);
            if (result) {
                context.report(node, result, {});
            }
        } catch (e) {
            context.report(node, `Unexpected error in eslint-plugin-require-path-exists: ${e.message}\n${e.stack}`, {});
        }
    }
}

function isInPackage(requirePath, node, context) {
    // Don't worry about relative paths or built ins
    if (isRelativePath(requirePath) || isBuiltInModule(requirePath)) {
        return;
    }
    var pkg = getLocalPackageJson(context.getFilename());
    if (pkg) {
        var dependencies = getDependencyList(pkg);
        var dependencyToValidate = getDepNameFromRequirePath(requirePath);
        if (dependencies.indexOf(dependencyToValidate) === -1) {
            context.report(node, 'dependency ' + dependencyToValidate + ' missing from local package.json', {
                dependency: requirePath
            });
        }
    }
};

function isRelativePath(requirePath) {
    return requirePath.indexOf('.') === 0;
}

function getLocalPackageJson(filename) {
    var basedir = path.dirname(filename);
    var packagePath = findup('package.json', {
        cwd: basedir
    });
    return packagePath ? JSON.parse(fs.readFileSync(packagePath)) : null;
}

function getDependencyList(pkg) {
    var dependencies = [];
    if (pkg.dependencies) {
        dependencies = dependencies.concat(Object.keys(pkg.dependencies));
    }
    if (pkg.optionalDependencies) {
        dependencies = dependencies.concat(Object.keys(pkg.optionalDependencies));
    }
    if (pkg.peerDependencies) {
        dependencies = dependencies.concat(Object.keys(pkg.peerDependencies));
    }
    if (pkg.devDependencies) {
        dependencies = dependencies.concat(Object.keys(pkg.devDependencies));
    }
    return dependencies;
}

function getDepNameFromRequirePath(requirePath) {
    if (requirePath.indexOf('/') === -1) {
        return requirePath;
    } else {
        if (isScopedModule(requirePath)) {
            var secondSlashIndex = requirePath.indexOf('/', requirePath.indexOf('/') + 1);
            if (secondSlashIndex === -1) {
                return requirePath;
            } else {
                return requirePath.substr(0, secondSlashIndex);
            }
        } else {
            return requirePath.substr(0, requirePath.indexOf('/'));
        }
    }
}

function isScopedModule(requirePath) {
    return requirePath.indexOf('@') === 0;
}

const exists = (context) => {
    let pluginSettings = {};
    if (context && context.options && typeof context.options[0] === 'object') {
        pluginSettings = context.options[0];
    }

    const config = {
        extensions: Array.isArray(pluginSettings.extensions) ? pluginSettings.extensions : ['', '.js', '.json', '.node'],
        webpackConfigPath: pluginSettings.webpackConfigPath === undefined ? null : pluginSettings.webpackConfigPath,
        aliases: {}
    };

    if (config.webpackConfigPath !== null) {
        config.aliases = getWebpackAliases(config.webpackConfigPath);
    }

    return {
        ImportDeclaration(node) {
            testRequirePath(node.source.value, node, context, config);
            isInPackage(node.source.value, node, context);
        },

        CallExpression(node) {
            if (node.callee.name !== 'require' || !node.arguments.length || typeof node.arguments[0].value !== 'string' || !node.arguments[0].value) {
                return;
            }

            testRequirePath(node.arguments[0].value, node, context, config);
            isInPackage(node.arguments[0].value, node, context);
        }
    };
};

module.exports = {
    rules: {
        exists
    },
    rulesConfig: {
        exists: [2, {
            extensions: ['', '.js', '.json', '.node']
        }]
    }
};
