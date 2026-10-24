/**
 * Example "before" fixture - represents a buggy implementation
 * This accepts negative numbers when it shouldn't
 */

module.exports = function validateInput(x) {
  // Bug: only checks upper bound, not lower bound
  return x < 100;
};
