'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.dependency_mapper = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  raw_repo: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/raw_repo/package.json');
    var expected = grunt.file.read('test/expected/raw_repo/package.json');
    test.equal(actual, expected, 'should map dependencies to a specific environment repository');

    test.done();
  },
  version_tag: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/version_tag/package.json');
    var expected = grunt.file.read('test/expected/version_tag/package.json');
    test.equal(actual, expected, 'should map dependencies to a specified version tag in an environment repo');

    test.done();
  },
  override: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/override/package.json');
    var expected = grunt.file.read('test/expected/override/package.json');
    test.equal(actual, expected, 'should override repository branch with specific dependency branch');

    test.done();
  },
  missing: function(test) {
    test.expect(1);

    test.throws(function() { grunt.file.read('tmp/missing/package.json') });

    test.done();
  }
};
