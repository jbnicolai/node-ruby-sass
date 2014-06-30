/*jshint expr:true*/

var path = require('path');
var fs = require('fs');
var Sass = require('..');
var chai = require('chai');
var expect = chai.expect;

var fixtures = {
  simple    : path.join(__dirname, 'fixtures', 'simple.scss'),
  bootstrap : path.join(__dirname, 'fixtures', 'bootstrap', 'bootstrap.scss'),
  broken    : path.join(__dirname, 'fixtures', 'broken.scss')
};

var expected = {
  simple    : path.join(__dirname, 'expected', 'simple.css'),
  bootstrap : path.join(__dirname, 'expected', 'bootstrap', 'bootstrap.css')
};

for (var key in expected) {
  if (expected.hasOwnProperty(key)) {
    expected[key] = fs.readFileSync(expected[key]).toString();
  }
}

describe('node-ruby-sass', function () {
  var sass = new Sass();

  before(function (done) {
    sass.on('ready', done);
  });

  it('works with a simple scss file with an import', function (done) {
    sass.compile(fixtures.simple, function (err, css) {
      expect(err).to.be.null;
      expect(css).to.equal(expected.simple);
      done();
    });
  });

  it('works with a big sass project', function (done) {
    sass.compile(fixtures.bootstrap, function (err, css) {
      expect(err).to.be.null;
      expect(css).to.equal(expected.bootstrap);
      done();
    });
  });

  it('handles sass syntax errors gracefully', function (done) {
    sass.compile(fixtures.broken, function (err, css) {
      expect(css).to.not.exist;
      expect(err).to.be.an.instanceof(Sass.CompilationError);
      expect(err.message).to.contain('Invalid CSS after');
      done();
    });
  });
});