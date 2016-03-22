var apeTasking = require('ape-tasking');
var apeReleasing = require('ut-ape-releasing');

module.exports = function() {
    apeTasking.runTasks('release', [
        function releasePackage(callback) {
            apeReleasing.releasePackage({
                beforeRelease: [],
                afterRelease: [],
                skipInteractive: true
            }, callback);
        }
    ], true);
};
