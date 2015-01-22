require('console.table');

var _        = require('lodash'),
    gulp     = require('gulp'),
    path     = require('path'),
    nodeunit = require('nodeunit').reporters.default,
    dir      = require('node-dir'),
    minimist = require('minimist');

var options = minimist(process.argv.slice(2), {
    string: 'file',
    default: null
});

var normalizeFilePaths = function(files) {
    return _.map(files, function(file) {
        var normalPath   = path.normalize(path.relative(__dirname, file)),
            properPath   = normalPath.split(path.sep).join('/'),
            relativePath = './' + properPath;
        return relativePath;
    });
};

var getAllFiles = function(pth, callback) {
    dir.files(pth, function(err, files) {
        if (err) { throw err; }

        files = normalizeFilePaths(files);
        callback(files);
    });
};

var runAll = function() {
    getAllFiles('./tests/unit', function(files) {
        nodeunit.run(files);
    });
    getAllFiles('./tests/perf', function(files) {
        nodeunit.run(files);
    });
};

var excludeFiles = function(files, fileName) {
    return _.filter(files, function(file) {
        var index = file.indexOf(fileName);
        return index > -1;
    });
};

gulp.task('default', runAll);

gulp.task('test', function() {
    if (!options.file) {
        return getAllFiles('./tests/unit', function(files) {
            nodeunit.run(files);
        });
    }

    var fileName = options.file;
    getAllFiles('./tests/unit', function(files) {
        files = excludeFiles(files, fileName);
        nodeunit.run(files);
    });
});

gulp.task('perf', function() {
    if (!options.file) {
        getAllFiles('./tests/perf', function(files) {
            nodeunit.run(files);
        });
    }

    var fileName = options.file;
    getAllFiles('./tests/perf', function(files) {
        files = excludeFiles(files, fileName);
        nodeunit.run(files);
    });
});