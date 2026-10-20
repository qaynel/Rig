# edge-boundary

Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Owned scope: `unit.edge-boundary`. Input: `rig-services/testing.unit.edge-boundary.json`.

Coverage ceiling: Configuration validation only, so it confirms boundary cases, invalid cases and the normal-only flag are declared; it does not run the tests.

minimal: boundary cases — ["empty input","maximum length"]. List the values on each side of every boundary. Normal inputs miss contract holes, so name the edge values.

mid: invalid cases — ["negative count"]. List the invalid inputs, such as empty and oversized. Untested invalid input crashes in production, so add them.

maximal: normal only tests — false. Set normal-only tests to false. Tests that never leave the happy path miss boundary bugs, so include edges.
