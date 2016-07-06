'use strict';

let fs = require('fs'),
    EOL = require('os').EOL,
    gulp = require('gulp'),
    bump = require('gulp-bump'),
    git = require('gulp-git'),
    gutil = require('gulp-util'),
    spawn = require('child_process').spawn,
    pargv = require('pargv').configure(3),
    shelljs = require('shelljs'),
    run = require('run-sequence'),
    del = require('del');

let pargs = pargv.parse();


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

// Clean dist
gulp.task('clean', (cb) => {
    return del('dist/**/*.*', cb);
});

// Compile typescript.
gulp.task('ts', (cb) => {

    shelljs.exec('tsc', (err, stdout, stderr) => {
        if(err)
            return handleError(err);
        if (stdout)
            console.log('[Typescript]: ' + stdout);
        if (stderr)
            console.log('[Typescript]: ' + stdout);
    }).on('exit', () => {
        cb();
    });

});

gulp.task('mocha', (cb) => {

    if (pargs.cmd !== 'commit:remote' && pargs.cmd !== 'commit:publish')
        return cb();

    shelljs.exec('mocha', (err, stdout, stderr) => {
        if(err)
            handleError(err);
        if (stdout)
            console.log('[mocha]: ' + stdout);
    }).on('exit', (code) => {
        cb();
    });

});

// Bumps the project's version.
gulp.task('bump', (cb) => {

    if (pargs.cmd !== 'commit:remote' && pargs.cmd !== 'commit:publish')
        return cb();

    return gulp.src(['./package.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));

});

gulp.task('build', (cb) => {
    let seq = ['clean', 'ts'];
    if (pargs.cmd === 'commit:remote' && pargs.cmd === 'commit:publish')
        seq = seq.concat(['mocha', 'bump']);
    return run(seq, cb);
});

// Remote commit.
gulp.task('commit', ['build']);

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
gulp.task('commit:remote', ['commit', 'push']);

// Publish to NPM after commit.
gulp.task('commit:publish', ['commit', 'push', 'pub']);
