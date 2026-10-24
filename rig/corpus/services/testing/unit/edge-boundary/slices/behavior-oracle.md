# testing.unit.edge-boundary — behavior-oracle slice

Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Policy grade slice `edge-boundary-slice-behavior-oracle`: List the values on each side of every boundary. Normal inputs miss contract holes, so name the edge values. Despite its name this slice is not a behavior oracle: it confirms boundary cases, invalid cases and the normal-only flag are declared; it does not run the tests.
