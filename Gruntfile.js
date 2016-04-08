/*
 * grunt-dependency-mapper
 * https://github.com/chrisschmidt/grunt-contrib-dependency-mapper
 *
 * Copyright (c) 2016 cschmidt
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    dependency_mapper: {
      raw_repo: {
        options: {
          env: 'development',
          files: [
            'test/fixtures/raw_repo/package.json'
          ],
          outputDir: 'tmp/raw_repo'
        }
      },
      version_tag: {
        options: {
          env: 'global',
          files: [
            'test/fixtures/version_tag/package.json'
          ],
          outputDir: 'tmp/version_tag'
        }
      },
      override: {
        options: {
          env: 'global',
          files: [
            'test/fixtures/override/package.json'
          ],
          outputDir: 'tmp/override'
        }
      },
      missing: {
        options: {
          env: 'none',
          files: [
              'test/fixtures/missing/package.json'
          ],
          outputDir: 'tmp/missing'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'dependency_mapper', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
