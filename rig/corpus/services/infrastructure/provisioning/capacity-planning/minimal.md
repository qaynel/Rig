# infrastructure.provisioning.capacity-planning — minimal

Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for capacity planning. The minimal boundary for capacity planning checks peak_requests_per_second (minimum 100): peak requests per second must meet the configured minimum of 100. Binding checks: capacity-planning-source-code-boundary.

Acceptance target: policy:infrastructure.provisioning.capacity-planning:minimal:capacity-planning-source-code-boundary.

Declared predicates: capacity-planning-source-code-boundary: `peak_requests_per_second` is numeric and at least 100.
