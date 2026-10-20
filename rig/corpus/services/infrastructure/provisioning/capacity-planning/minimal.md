# infrastructure.provisioning.capacity-planning — minimal

Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Policy grade, minimal: Declare the peak requests per second, at least 100. A lower figure is not a peak workload, so size from the real maximum. Binding checks: capacity-planning-source-code-boundary.

Acceptance target: policy:infrastructure.provisioning.capacity-planning:minimal:capacity-planning-source-code-boundary.
Declared predicates: capacity-planning-source-code-boundary: `peak_requests_per_second` is numeric and at least 100.
