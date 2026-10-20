# infrastructure.provisioning.capacity-planning — identity

Policy grade: capacity-planning owns provisioning.capacity-planning. Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Input: `rig-services/infrastructure.provisioning.capacity-planning.json`. Configuration validation only, so it confirms a peak request rate, headroom and the growth-forecast flag are declared; it does not test that the hardware sustains the load.

Disposition: executable.
Acceptance target: policy:infrastructure.provisioning.capacity-planning:minimal:capacity-planning-source-code-boundary.
Declared predicates: capacity-planning-source-code-boundary: `peak_requests_per_second` is numeric and at least 100.
