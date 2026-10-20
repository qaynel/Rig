# infrastructure.provisioning.capacity-planning — identity

Policy grade: capacity planning owns provisioning.capacity-planning. Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Keep neighboring provisioning services outside the capacity planning decision for provisioning.capacity-planning. Use the configured input at `rig-services/infrastructure.provisioning.capacity-planning.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Choose a repository-owned check that observes capacity planning from rig-services/infrastructure.provisioning.capacity-planning.json.

Acceptance target: policy:infrastructure.provisioning.capacity-planning:minimal:capacity-planning-source-code-boundary.

Declared predicates: capacity-planning-source-code-boundary: `peak_requests_per_second` is numeric and at least 100.
