# testing.unit.edge-boundary — behavior-oracle slice

Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Policy grade slice. This slice bounds edge boundary to unit.edge-boundary. It uses `edge-boundary-slice-behavior-oracle` and checks boundary_cases (nonempty): boundary cases must name the concrete repository contract.