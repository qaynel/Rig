# infrastructure.provisioning.capacity-planning — identity

Policy grade: capacity planning owns provisioning.capacity-planning. Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Keep neighboring provisioning services outside the capacity planning decision for provisioning.capacity-planning. Use the configured input at `rig-services/infrastructure.provisioning.capacity-planning.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Choose a repository-owned check that observes capacity planning from rig-services/infrastructure.provisioning.capacity-planning.json.

Acceptance target: fixture:infrastructure.provisioning.capacity-planning:policy-boundary. Given source-code is present and provisioning.capacity-planning is selected, pass only when the repository binding evaluates provisioning.capacity-planning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern.

Service-specific evidence cues:
Offer: Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.
minimal: peak requests per second — 100.
mid: headroom percent — 30.
maximal: ignore growth forecast — false.
