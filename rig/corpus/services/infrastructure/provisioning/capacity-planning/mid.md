# infrastructure.provisioning.capacity-planning — mid

Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Policy grade, mid: Keep headroom of at least 30 percent. Running at the forecast leaves no room for error, so add margin. Cumulative with minimal. Binding checks: capacity-planning-source-code-boundary, capacity-planning-provisioning-context.

Acceptance target: policy:infrastructure.provisioning.capacity-planning:mid:capacity-planning-source-code-boundary+capacity-planning-provisioning-context.
Declared predicates: capacity-planning-source-code-boundary: `peak_requests_per_second` is numeric and at least 100; capacity-planning-provisioning-context: `headroom_percent` is numeric and at least 30.
