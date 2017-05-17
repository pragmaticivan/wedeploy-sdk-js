'use strict';

const babelPresetMetal = require('babel-preset-metal');
const babelPresetResolveSource = require('babel-preset-metal-resolve-source');
const concat = require('gulp-concat');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const isparta = require('isparta');
const metal = require('gulp-metal');
const mocha = require('gulp-mocha');
const nodeExternals = require('webpack-node-externals');
const runSequence = require('run-sequence');
const Server = require('karma').Server;
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');

const release = process.env.NODE_ENV === 'production';

const plugins = [];
const watch = process.env.WATCH === 'true';
let apiSuffix = '';
let socketIoSuffix = '';
let sourceMap = 'inline-source-map';

if (release) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  apiSuffix = '-min';
  socketIoSuffix = '.min';
  sourceMap = false;
}

let options = {
  buildSrc: ['src/**/!(node)/*.js', '!src/env/node.js'],
  globalName: 'wedeploy',
  src: 'src/env/browser.js',
  testNodeSrc: [
    'test/environment/node/env.js',
    'test/**/*.js',
    '!test/**/browser/**/*.js',
  ],
  testSaucelabsBrowsers: {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
    },
    sl_safari_9: {
      base: 'SauceLabs',
      browserName: 'safari',
      version: '9',
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
    },
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '10',
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11',
    },
    sl_edge_20: {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      platform: 'Windows 10',
      version: '13',
    },
    sl_edge_21: {
      base: 'SauceLabs',
      browserName: 'microsoftedge',
      platform: 'Windows 10',
      version: '14',
    },
    sl_iphone: {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: 'OS X 10.10',
      version: '9.2',
    },
    sl_android_4: {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '4.4',
    },
    sl_android_5: {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '5.0',
    },
  },
  useEslint: true,
};
metal.registerTasks(options);

gulp.task('build:browser', function() {
  const webpackConfig = {
    devtool: sourceMap,
    entry: {
      browser: './src/env/browser.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['env', {modules: false}], 'es2015'],
            },
          },
        },
      ],
    },
    plugins: plugins,
    output: {
      filename: `build/browser/api${apiSuffix}.js`,
      libraryTarget: 'umd',
    },
  };

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        const output = stats.toString({
          colors: true,
          chunks: false,
        });
        console.log(output);
        resolve(output);
      }
    });
  });
});

gulp.task('build:node', function() {
  const webpackConfig = {
    devtool: sourceMap,
    entry: {
      node: './src/env/node.js',
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['env', {modules: false}], 'es2015'],
            },
          },
        },
      ],
    },
    plugins: plugins,
    output: {
      filename: `build/node/api${apiSuffix}.js`,
      libraryTarget: 'commonjs2',
    },
    target: 'node',
  };

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        const output = stats.toString({
          colors: true,
          chunks: false,
        });
        resolve(output);
      }
    });
  });
});

gulp.task('clear', function() {
  return del(['build']);
});

gulp.task('build', function(done) {
  runSequence(
    'clear',
    ['lint', 'build:browser', 'build:node'],
    'build:socket',
    done
  );
});

/* eslint-disable no-console,require-jsdoc */
gulp.task('ci', function(done) {
  if (process.env.SAUCE_USERNAME) {
    return runSequence('lint', 'test:saucelabs', 'test:node', done);
  }
  console.warn('Not running tests (most likely due to security restrictions)');
  console.warn('See https://docs.travis-ci.com/user/sauce-connect/ for help');
  done();
});

gulp.task('build:socket', function() {
  if (release) {
    return concatSocketIORelease(
      `build/browser/api${apiSuffix}.js`,
      'build/browser'
    );
  } else {
    return concatSocketIO(`build/browser/api${apiSuffix}.js`, 'build/browser');
  }
});

gulp.task('build:watch', ['build'], function() {
  gulp.watch(['src/**/*', 'test/**/*'], ['build']);
});

gulp.task('lint', function() {
  return gulp
    .src(['src/**/*.js', 'test/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('test', function(done) {
  runSequence('test:browsers', 'test:node', done);
});

gulp.task('test:browsers', function(done) {
  new Server(
    {
      browsers: ['Chrome'],

      exclude: ['src/env/node.js', 'test/**/node/**/*.js'],

      files: [
        {pattern: 'node_modules/metal/src/**/*.js', watched: false},
        {pattern: 'node_modules/metal-*/src/**/*.js', watched: false},
        {pattern: 'src/**/!(node)/*.js', watched: false},
        {pattern: 'test/environment/browser/env.js', watched: false},
        {pattern: 'test/**/*.js', watched: false},
      ],

      frameworks: ['mocha', 'chai', 'sinon'],

      preprocessors: {
        'node_modules/metal/src/**/*.js': ['webpack'],
        'node_modules/metal-*/src/**/*.js': ['webpack'],
        'src/**/!(node)/*.js': ['webpack'],
        'test/environment/browser/env.js': ['webpack'],
        'test/**/*.js': ['webpack'],
      },

      webpack: {
        // set devtool to 'inline-source-map' if source maps are needed.
        // disabled by default since with source maps test run twice slower
        devtool: false,
      },

      webpackMiddleware: {
        noInfo: true,
        stats: 'errors-only',
      },
      singleRun: !watch,
    },
    done
  ).start();
});

gulp.task('test:coverage', function(done) {
  let babelOptions = {
    presets: [babelPresetResolveSource, babelPresetMetal],
    sourceMap: 'both',
  };

  new Server(
    {
      frameworks: ['mocha', 'chai', 'sinon', 'source-map-support', 'commonjs'],

      files: [
        'node_modules/metal/src/**/*.js',
        'node_modules/metal-*/src/**/*.js',
        'src/**/!(node)/*.js',
        'test/environment/browser/env.js',
        'test/**/*.js',
      ],

      exclude: ['src/env/node.js', 'test/**/node/**/*.js'],

      preprocessors: {
        'src/**/!(*.soy).js': ['coverage', 'commonjs'],
        'src/**/*.soy.js': ['babel', 'commonjs'],
        'node_modules/metal/**/*.js': ['babel', 'commonjs'],
        'node_modules/metal-*/**/*.js': ['babel', 'commonjs'],
        'test/**/*.js': ['babel', 'commonjs'],
      },

      browsers: ['Chrome'],

      reporters: ['coverage', 'progress'],

      babelPreprocessor: {options: babelOptions},

      coverageReporter: {
        instrumenters: {isparta: isparta},
        instrumenter: {'**/*.js': 'isparta'},
        instrumenterOptions: {isparta: {babel: babelOptions}},
        reporters: [{type: 'lcov', subdir: 'lcov'}, {type: 'text-summary'}],
      },
    },
    done
  ).start();
});

gulp.task('test:node', function() {
  return gulp
    .src(
      [
        'test/environment/node/env.js',
        'test/**/*.js',
        '!test/**/browser/**/*.js',
      ],
      {read: false}
    )
    .pipe(
      mocha({
        compilers: 'js:babel-core/register',
      })
    );
});

gulp.task('test:node:watch', ['test:node'], function() {
  gulp.watch(['src/**/*', 'test/**/*'], ['test:node']);
});

function concatSocketIO(filePath, dest) {
  return gulp
    .src([
      `node_modules/socket.io-client/dist/socket.io${socketIoSuffix}.js`,
      filePath,
    ])
    .pipe(
      sourcemaps.init({
        loadMaps: true,
      })
    )
    .pipe(concat(`api${apiSuffix}.js`))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest));
}

function concatSocketIORelease(filePath, dest) {
  return gulp
    .src([
      `node_modules/socket.io-client/dist/socket.io${socketIoSuffix}.js`,
      filePath,
    ])
    .pipe(concat(`api${apiSuffix}.js`))
    .pipe(gulp.dest(dest));
}
