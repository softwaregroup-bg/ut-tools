var fs = require('fs');

var SgBuild = function (buildNumber) {
    this.packageJsonFilePath = "./package.json";
    this.packageJson = {};
    this.buildNumber = buildNumber;
    this.packageJsonIsDirty = false;

    this._loadPackageJson();
};

SgBuild.prototype.build = function () {
    this.preBuild();
    this.build();
};

SgBuild.prototype._preBuild = function () {
    this.packageJson.version = this.packageJson.version + "-dev." + this.buildNumber;
    this.savePackageJson();
};


SgBuild.prototype._loadPackageJson = function () {
    var stats = fs.lstatSync(this.packageJsonFilePath);
    if (!stats.isFile()) {
        throw new Error(this.packageJsonFilePath + " not found");
    }

    this.packageJson = JSON.parse(fs.readFileSync(this.packageJsonFilePath, 'utf8'));
};

SgBuild.prototype.setPackageJsonFilePath = function(filePath){
    this.packageJsonFilePath = filePath;
}

SgBuild.prototype.savePackageJson = function(){
    var jsonData = JSON.stringify(this.packageJson, null, 2)
    this.verbose(jsonData);
}

SgBuild.prototype.verbose = function(msg){
    console.log(msg)
}

exports.SgBuild = SgBuild;