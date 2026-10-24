# Learning Fixture Format

This directory contains fixtures for real learning proof tests (PT-060 amendment).

## Format Requirements

Each learning test case must supply:

1. **`before`** - Path to a source file representing the pre-fix state
2. **`check`** - Path to the proposed fix
3. **`input`** - Array of case objects with deterministic inputs

## Execution Model

The test runner:
1. Executes `before(input)` in a sandboxed `spawnSync`
2. Executes `check(input)` in a sandboxed `spawnSync`
3. Records actual boolean outcomes
4. Asserts `before` returns a failing result and `check` returns a passing one for each positive case

## File Structure

```
learning/
  example-validation/
    before.js          # Pre-fix implementation (has bug)
    check.js           # Fixed implementation
    cases.json         # Test inputs and expected outcomes
  README.md            # This file
```

## Example: cases.json

```json
{
  "positive": [
    { "id": "c1", "input": -1, "fails_before": true }
  ],
  "negative": [
    { "id": "c2", "input": 50, "fails_before": false }
  ]
}
```

## Constraints

- All fixtures are checked in (no generated fixtures)
- Scripts must be executable Node.js modules
- Inputs must be deterministic (no random values, no timestamps)
- No network access or file I/O in script execution
- Scripts timeout after 5 seconds

## Amendment Context

Related to:
- PT-060 oracle amendment (removes simulation path)
- RP-07/RP-08 from second-round design review
- Section 5 of 2026-10-24 implementation handoff plan

The simulation branch (`caught = fails_before`) is being removed from production code. Historical boolean-only fixtures become invalid and must be upgraded to this executable format.
