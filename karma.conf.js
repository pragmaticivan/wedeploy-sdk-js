var isparta = require('isparta');
var metal = require('metal');

var babelOptions = {
  resolveModuleSource: metal.renameAlias,
  sourceMap: 'both'
};

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon', 'source-map-support', 'commonjs'],

    files: [
      'bower_components/**/*.js',
      'src/*.js',
      'test/*.js'
    ],

    preprocessors: {
      'bower_components/**/*.js': ['babel', 'commonjs'],
      'src/*.js': ['coverage', 'commonjs'],
      'test/*.js': ['babel', 'commonjs']
    },

    browsers: ['Chrome'],

    reporters: ['coverage', 'progress'],

    babelPreprocessor: {options: babelOptions},

    coverageReporter: {
      instrumenters: {isparta : isparta},
      instrumenter: {'**/*.js': 'isparta'},
      instrumenterOptions: {isparta: {babel: babelOptions}},
      reporters: [
        {type: 'html'},
        {type: 'lcov', subdir: 'lcov'},
        {type: 'text-summary'}
      ]
    }
  });
};
