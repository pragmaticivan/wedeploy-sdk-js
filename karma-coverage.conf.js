var fs = require('fs');
var isparta = require('isparta');

module.exports = function (config) {
	config.set({
		frameworks: ['mocha', 'chai', 'sinon', 'source-map-support', 'commonjs'],

		files: [
			'node_modules/closure-templates/soyutils.js',
			'node_modules/metal/src/**/*.js',
			'node_modules/metal-*/src/**/*.js',
			'src/**/*.js',
			'test/enviroment/browser/env.js',
			'test/**/*.js'
		],

		exclude: [
			'src/**/node/**/*.js',
			'test/**/node/**/*.js'
		],

		preprocessors: {
			'src/**/!(*.soy).js': ['coverage', 'commonjs'],
			'src/**/*.soy.js': ['babel', 'commonjs'],
			'node_modules/metal/**/*.js': ['babel', 'commonjs'],
			'node_modules/metal-*/**/*.js': ['babel', 'commonjs'],
			'test/**/*.js': ['babel', 'commonjs']
		},

		browsers: ['Chrome'],

		reporters: ['coverage', 'progress'],

		coverageReporter: {
			instrumenters: {isparta : isparta},
			instrumenter: {'**/*.js': 'isparta'},
			reporters: [
				{type: 'lcov', subdir: 'lcov'},
				{type: 'text-summary'}
			]
		}
	});
};
