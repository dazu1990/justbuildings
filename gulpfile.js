var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins         = gulpLoadPlugins();

var del             = require('del');
var pathExists      = require('path-exists');
var runSequence     = require('run-sequence');
var inquirer        = require('inquirer');
var fs              = require('fs');
var karma           = require('karma').Server;

var config          = require('./config.json');


/*

  Vars

*/
var config, jsSources, svgSources;

var src = {
  base:    './src',
  components: './src/components',
  modules: './src',
  min:     './src/min',
};

var dist = {
  base:    './dist',
  modules: './dist/js',
  min:     './dist/min',
}

var filenames = {
  css: 'application.min.css',
  js:  'application.min.js'
}

var svgSources = [
  src.modules + '/**/icon-*.svg',
  '!' + src.modules + '/fonts/**.*'
];

loadConfigFile();


/*

  Functions and Utilities

*/
function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
}

function fileContents(filePath, file) {
  return file.contents.toString();
}

// load the config file using fs (require caches it so we can’t reload it)
function loadConfigFile(){
  config = JSON.parse( fs.readFileSync('./config.json', 'utf8') );

  // add all js files in src/modules/ to libs list from config.json (bower, etc)
  // the app, init, * order is necessary so angular recognizes modules properly.
  // Test files are excluded.
  jsSources = config.js.lib.concat([
    // src.components + '/components',
    src.modules + '/js/main.js',
    src.modules + '/js/*/.js',
    src.modules + '/js/**/*.js'
  ]);
};


/*

  Tasks

*/

// Cleaning (except for dist/.git)
gulp.task('clean', function(){
  return del([ dist.base + '/*', '!'+dist.base+'/.git*' ]);
});

/*

  Styles

*/

// SASS compiling: all sass files -> single CSS file
// (except base.sass which gets inlined)
gulp.task('sass:dev', function() {
  return gulp.src([ src.modules + '/**/*.sass', '!'+src.modules+'/sass/base.sass' ])
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({
        // style: 'compressed',
        indentedSyntax: true,
        includePaths: [
          src.components + '/standardize',
          src.modules + '/sass'
        ]
      }))
      .on('error', swallowError)
      .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      // .pipe(plugins.cssmin())
      .pipe(plugins.concat(filenames.css))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(src.min))
});

gulp.task('sass:dist', function() {
  return gulp.src([ src.modules + '/**/*.sass', '!'+src.modules+'/sass/base.sass' ])
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({
        // style: 'compressed',
        indentedSyntax: true,
        includePaths: [
          src.components + '/standardize',
          src.modules + '/sass'
        ]
      }))
      .on('error', swallowError)
      .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(plugins.cssmin())
      .pipe(plugins.concat(filenames.css))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(dist.min));
});

// base.sass gets inlined
gulp.task('basesass', function(){
  return gulp.src([ src.modules + '/sass/base.sass' ])
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({
        style: 'compressed',
        indentedSyntax: true
      }))
      .on('error', swallowError)
      .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(plugins.cssmin())
      .pipe(plugins.rename('base.min.css'))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(src.min))
});
/*

  Scripts

*/

// JS linting task.
gulp.task('jshint', function () {
  return gulp.src([
      src.modules + '/js/*.js'
    ])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'));
});


function getSvgIcons(){
  return gulp.src(svgSources)
    .pipe(plugins.svgmin())
    .pipe(plugins.svgstore({ inlineSvg: true }))
}

// Inject svg defs into index.html
gulp.task('svgInject', function() {
  return gulp.src(src.base + '/index.html')
    .pipe(plugins.inject(getSvgIcons(), { transform: fileContents }))
    .pipe(gulp.dest(src.base));
});
// '!css/ignnore.css',
// concat all scripts into a single js file to be loaded by mustard.js
gulp.task('scripts:dev', function(){
  return gulp.src(jsSources)
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.concat(filenames.js))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(src.min));
})

// same as above but uglify too
gulp.task('scripts:dist', function(){
  return gulp.src(jsSources)
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.ngAnnotate())
      .pipe(plugins.uglify({ mangle: false }))
      .pipe(plugins.concat(filenames.js))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(dist.min));
})

// when the config json file changes, reload it
gulp.task('reloadConfig', function(done){
  loadConfigFile();
  runSequence( 'scripts:dev', done );
})

/*

  Other

*/

// Minify all the module templates and move them to /dist.
gulp.task('templates', function() {
  return gulp.src(src.modules + '/**/*.html')
    .pipe(plugins.minifyHtml({conditionals: true, quotes: true}))
    .pipe(gulp.dest(dist.modules));
});

// Minify all the svg files and move them.
gulp.task('svgmin', function() {
  return gulp.src([
      src.modules + '/**/*.svg',
      '!' + src.modules + '/**/icon-*.svg', // This line can be commented to include the icon file in dist.
      '!' + src.min + '/fonts/**.*'
    ])
    .pipe(plugins.svgmin())
    // .pipe(plugins.rename(function(path) {
    //   // Remove the module directory to maintain relative paths.
    //   if (path.dirname.indexOf('/') != -1) {
    //     path.dirname = path.dirname.substring(path.dirname.indexOf('/') + 1);
    //   }
    // }))
    .pipe(gulp.dest(dist.modules));
});

// Minify all the image files and move them.
gulp.task('imagemin', function() {
  return gulp.src([src.modules + '/**/*.{png,gif,jpg}'])
    .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    // .pipe(plugins.rename(function(path){
    //   // Remove the module directory to maintain relative paths.
    //   console.log(path);
    //   if (path.dirname.indexOf('/') != -1) {
    //     path.dirname = path.dirname.substring(path.dirname.indexOf('/') + 1);
    //   }
    // }))
    .pipe(gulp.dest(dist.modules));
});

// inline everything with 'inline' attribute
gulp.task('inline', function(){
  return gulp.src('src/index.html')
    // .pipe(plugins.minifyHtml({conditionals: true, quotes: true}))
    .pipe(plugins.inlineSource())
    .pipe(gulp.dest(dist.base))
});

// Move things that don't need to be minified.
gulp.task('move', function() {
  return gulp.src([
    src.modules + '/**/*.json',
    src.min + '/*.css',
    src.min + '/fonts/*.*',
    src.base + '/.htaccess',
    src.base + '/require.js'
  ], { base: 'src/'})
    .pipe(gulp.dest(dist.base));
});

//Set the correct base path for HTML5 mode.
// gulp.task('basepath', function() {
//   return gulp.src('dist/index.html')
//     .pipe(plugins.replace('<base href="/basicbuild/src/">', '<base href="/basicbuild/dist/">'))
//     .pipe(gulp.dest(dist.base));
// });

// Set a custom base path for HTML5 mode.
// gulp.task('basepath:deploy', function(done) {
//   inquirer.prompt([{
//     type: 'input',
//     name: 'custompath',
//     message: 'Enter the new base path:'
//   }], function(answers) {
//     var path = (answers.custompath && answers.custompath !== '' ) ? answers.custompath : '/';
//     console.log('The new base path is: %s', path);
//     gulp.src('dist/index.html')
//       .pipe(plugins.replace('<base href="/bbc-women/src/">', '<base href="' + path + '">'))
//       .pipe(gulp.dest(dist.base));

//     done();
//   });
// });


/*

  ###  ###  ######  ######  ##   ## ##    ######
  ######## ##    ## ##   ## ##   ## ##    ##
  ## ## ## ##    ## ##   ## ##   ## ##    #####
  ##    ## ##    ## ##   ## ##   ## ##    ##
  ##    ##  ######  ######   #####  ##### ######

  Create a new module.

*/
gulp.task('module', function(done) {

  inquirer.prompt([{
    type: 'input',
    message: 'What do you want to call your new module?',
    name: 'module'
  }], function(answers) {
    if (answers.module) {

      var dirname = answers.module.split('.').pop();

      var string = [
        ";(function(AppConfig) {\n",
        "  'use strict';\n\n",
        "  AppConfig.registerModule('" + answers.module + "');\n\n",
        "})(window.AppConfig);"
      ].join('');

      pathExists(src.modules + '/' + dirname).then(function(exists) {
        if (!exists) {
          return plugins.file('init.js', string, {src: true})
            .pipe(gulp.dest(src.modules + '/' + dirname))
            .pipe(plugins.util.log(plugins.util.colors.green(answers.module), 'Module Created'))
        } else {
          return plugins.util.log(plugins.util.colors.red(answers.module + ' already exists!'));
        }
      });

    }
    done();
  });

});

/*

  Tests

  Run tests

*/

gulp.task('karma', function(done) {

  new karma({
    configFile: __dirname + '/karma.conf.js',
    // action: 'run',
    singleRun: true
  }, done).start();

});

/*

  ###### #####   ####  ##  ##  ####
    ##  ##   ## ##     ## ##  ##
    ##  #######  ####  ####    ####
    ##  ##   ##     ## ## ##      ##
    ##  ##   ## #####  ##  ## #####

  intended for command line usage

*/

// The default (watch) task.
gulp.task('default', [ 'sass:dev', 'basesass', 'scripts:dev', /*'svgInject',*/ 'jshint' ], function() {
  plugins.livereload.listen();

  gulp.watch([src.modules + '/**/*.sass'], ['sass:dev']);
  gulp.watch([src.modules + '/core/sass/base.sass'], ['basesass']);
  gulp.watch([src.min + '/*.css'], plugins.livereload.changed);

  gulp.watch([src.base + '/**/*.html'], plugins.livereload.changed);

  gulp.watch(src.modules + '/**/*.js', ['jshint', 'scripts:dev']);
  gulp.watch([src.base + '/*.js', src.min + '/*.js'], plugins.livereload.changed);

  // gulp.watch(svgSources, ['svgInject']);

  gulp.watch('./config.json', ['reloadConfig']);
});

// Testing.
gulp.task('test', ['karma']);

// The build task.
gulp.task('build', function(done) {
  runSequence(
    // ['test'],
    ['clean', /*'svgInject'*/],
    ['sass:dist', 'jshint', 'scripts:dist', 'imagemin', 'svgmin', 'templates', 'move', 'inline'],
    // ['basepath'],
    done
  );
});

// gulp.task('deploy', function(done) {
//   runSequence(
//     ['test'],
//     ['clean', /*'svgInject'*/],
//     ['sass:dist', 'jshint', 'scripts:dist', 'imagemin', 'svgmin', 'templates', 'move', 'inline'],
//     ['basepath:deploy'],
//     done
//   );
// });
