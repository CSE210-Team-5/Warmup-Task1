const { getSummaries } = require('../src/stretchtext.js'); // Replace 'yourCodeFile' with the actual file path.

// Describe a test suite for the getSummaries function
describe('getSummaries', function () {
  // Test case 1: Check if the function returns an array
  it('should return an array', function () {
    const result = getSummaries();
    if (!Array.isArray(result)) {
      throw new Error('Result should be an array');
    }
  })
});