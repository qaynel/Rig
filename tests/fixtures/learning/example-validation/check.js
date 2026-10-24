/**
 * Example "check" fixture - represents the fixed implementation
 * This correctly validates the input range
 */

module.exports = function validateInput(x) {
  // Fixed: checks both bounds
  return x > 0 && x < 100;
};
