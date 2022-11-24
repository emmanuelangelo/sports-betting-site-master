const config = {
    testEnvironment: './jest-environment.js',
    collectCoverage: true,
    verbose: true,
    bail: 1,
    // testRegex: ".unit.test.js", // only run unit tests
    // testRegex: '.int.test.js', // only run integration tests
    // testRegex: 'accordion.unit.test.js', // only run test by name
    testMatch: ['**/reducer/**/*.test.js'], // only run tests in given path
  };
  
  module.exports = config;
  