'use strict';

let fs = require('fs'),
    gulp = require('gulp'),
    bump = require('gulp-bump'),
    git = require('gulp-git'),
    gutil = require('gulp-util'),
    ts = require('gulp-typescript'),
    spawn = require('child_process').spawn,
    pargv = require('pargv'),
    shelljs = require('shelljs'),
    pargs = pargv.parse();

// Common handler for gulp errors.
function handleError(err) {
    if (!err || !err.message)
        err = undefined;
    throw new gutil.PluginError('gulp-<%= pluginName %>', err || new Error('Unknown build error'));
}

// Git commit common task.
function commit() {

    let flags,
        keys;

    // Convert flags to array.
    flags = pargv.flagsToArray({ 'a': true, 'm': 'Lazy commit' });


    // Commit the project.
    return gulp.src('./*')
        .pipe(git.commit(undefined, {
            args: flags.join(' '),
            disableMessageRequirement: true
        }));

}

// Compile typescript.
gulp.task('ts', (cb) => {

    shelljs.exec('tsc', (err, stdout, stderr) => {
        if(err)
            return handleError();
        if (stdout)
            console.log('[Typescript]: ' + stdout);
        if (stderr)
            console.log('[Typescript]: ' + stdout);
    }).on('exit', () => {
        cb();
    });

});

// Nothing special just copy src file(s).
gulp.task('copy', () => {
    return gulp.src('./src/index.ts')
        .pipe(gulp.dest('./dist'));
});

gulp.task('test', (cb) => {
    shelljs.exec('npm test', (err, stdout, stderr) => {
        if(err)
            handleError(err);
        if (stdout)
            console.log('[Test]: ' + stdout);
        if (stderr)
            console.log('[Test]: ' + stdout);
    }).on('exit', (code) => {
        cb();
    });

});

gulp.task('build', ['ts', 'copy']);

// Bumps the project's version.
gulp.task('bump', (cb) => {

    if (pargs.cmd === 'commit:local')
        return cb();

    return gulp.src(['./package.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));

});

// Remote commit.
gulp.task('commit', commit);

// Push commit(s) to remote repo.
gulp.task('push', (cb) => {
    return git.push('origin', 'master', {}, function (err) {
        if (err)
            throw err;
        cb();
    });
});

// Publish the project to NPM.
gulp.task('pub', (cb) => {
    return spawn('npm', ['publish'], { stdio: 'inherit' }).on('close', function () {
        cb();
    });
});

// Commit locally without bumping version.
gulp.task('commit:local', ['commit']);

// Bump project then commit & push.
gulp.task('commit:remote', ['bump', 'commit', 'push']);

// Publish to NPM after commit.
gulp.task('commit:publish', ['bump', 'commit', 'push', 'pub']);
