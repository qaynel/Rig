# infrastructure.provisioning.capacity-planning — maximal

Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Policy grade, maximal: Set ignoring the growth forecast to false. Capacity sized for today fails next quarter, so include growth assumptions. Cumulative with minimal and mid. Binding checks: capacity-planning-source-code-boundary, capacity-planning-provisioning-context, capacity-planning-evidence-receipt.

Acceptance target: policy:infrastructure.provisioning.capacity-planning:maximal:capacity-planning-source-code-boundary+capacity-planning-provisioning-context+capacity-planning-evidence-receipt.
Declared predicates: capacity-planning-source-code-boundary: `peak_requests_per_second` is numeric and at least 100; capacity-planning-provisioning-context: `headroom_percent` is numeric and at least 30; capacity-planning-evidence-receipt: `ignore_growth_forecast` equals false.
