# infrastructure.provisioning.capacity-planning — maximal

Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: capacity-planning-source-code-boundary, capacity-planning-provisioning-context, capacity-planning-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.provisioning.capacity-planning:maximal:capacity-planning-source-code-boundary+capacity-planning-provisioning-context+capacity-planning-evidence-receipt.

Declared predicates: capacity-planning-source-code-boundary: `peak_requests_per_second` is numeric and at least 100; capacity-planning-provisioning-context: `headroom_percent` is numeric and at least 30; capacity-planning-evidence-receipt: `ignore_growth_forecast` equals false.
