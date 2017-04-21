let babelPresetMetal = require('babel-preset-metal');
let babelPresetResolveSource = require('babel-preset-metal-resolve-source');
let isparta = require('isparta');

let babelOptions = {
  presets: [babelPresetResolveSource, babelPresetMetal],
  sourceMap: 'both',
};

module.exports = function(config) {
  config.set({
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
  });
};
