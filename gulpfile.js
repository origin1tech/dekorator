///* eslint no-var:0, one-var: 0 */

var gulp = require('gulp'),
    bump = require('gulp-bump'),
    git = require('gulp-git'),
    spawn = require('child_process').spawn,
    argv = process.argv.splice(2),
    cmd = argv.shift();

// Normalize args for commit.
function normalizeArgs() {
  var args = argv;
  if (!args || !args.length)
      args = '-a -m "lazy commit"';
  else
      args = args.join(' ');
  return args;
}

// Git commit common task.
function commit() {

  // Normalize args setting default
  // message or joining args.
  var args = normalizeArgs();

  // Commit the project.
  return gulp.src('./*')
    .pipe(git.commit(undefined, {
        args: args,
        disableMessageRequirement: true
    }));

}

// Bumps the project's version.
gulp.task('bump', function(cb) {

  if (cmd === 'commit:local')
    return cb();

  return gulp.src(['./package.json'])
      .pipe(bump())
      .pipe(gulp.dest('./'));

});

// Remote commit.
gulp.task('commit', ['bump'], commit);

// Push commit(s) to remote repo.
gulp.task('push', function(cb) {
    return git.push('origin', 'master', {}, function(err) {
        if (err)
          throw err;
        cb();
    });
});

// Publish the project to NPM.
gulp.task('pub', function(cb) {
    return spawn('npm', ['publish'], { stdio: 'inherit' }).on('close', function() {
        cb();
    });
});

// Commit locally without bumping version.
gulp.task('commit:local', ['commit']);

// Bump project then commit & push.
gulp.task('commit:remote', ['bump', 'commit', 'push']);

// Publish to NPM after commit.
gulp.task('commit:publish', [ 'bump', 'commit', 'push', 'pub']);
