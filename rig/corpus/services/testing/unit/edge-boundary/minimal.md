# testing.unit.edge-boundary — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for edge boundary. It checks boundary_cases (nonempty): boundary cases must name the concrete repository contract.. Binding checks: edge-boundary-source-code-boundary.

Read a repository-owned command or existing native check that can observe unit.edge-boundary; bind it to the input named in `rig-services/testing.unit.edge-boundary.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside unit.edge-boundary is a failure.

Acceptance target: fixture:testing.unit.edge-boundary:policy-boundary. Given source-code is present and unit.edge-boundary is selected, pass only when the repository binding evaluates unit.edge-boundary and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Owned scope: `unit.edge-boundary`.

Offer: Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Input: `rig-services/testing.unit.edge-boundary.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: edge boundary configuration validation only; declared policy does not prove running edge boundary behavior. Select an approved repository-owned command to verify that behavior.

minimal: boundary cases — ["empty input","maximum length"].

mid: invalid cases — ["negative count"].

maximal: normal only tests — false.
