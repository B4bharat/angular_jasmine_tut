var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var karma = require('karma');
var karmaParseConfig = require('karma/lib/config').parseConfig;
var gutil = require('gulp-util');
var path = require('path');

function runKarma(configFilePath, options, cb) {

    configFilePath = path.resolve(configFilePath);

    var server = karma.server;
    var log=gutil.log, colors=gutil.colors;
    var config = karmaParseConfig(configFilePath, {});

    Object.keys(options).forEach(function(key) {
      config[key] = options[key];
    });

    server.start(config, function(exitCode) {
        log('Karma has exited with ' + colors.red(exitCode));
        cb();
    });
}

gulp.task('tests', function(cb) {
    runKarma('karma.conf.js', {
        'autoWatch': true,
        'singleRun': false
    }, cb);
});

gulp.task('host', function() {
  browserSync.init({
    'server': {
      'baseDir': './app'
    }
  });
});

gulp.task('serve', ['host'], function() {

  gulp.start('tests');

  gulp.watch('./app/services/**/*.js', ['tests']);

  gulp.watch('./app/**').on('change', browserSync.reload);
});