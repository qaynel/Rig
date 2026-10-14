# infrastructure.provisioning.capacity-planning — identity

Policy grade: capacity planning owns provisioning.capacity-planning. Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Keep sibling services in provisioning under their own verdicts. Use the configured input at `rig-services/infrastructure.provisioning.capacity-planning.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.provisioning.capacity-planning:policy-boundary. Given source-code is present and provisioning.capacity-planning is selected, pass only when the repository binding evaluates provisioning.capacity-planning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern.

Service-specific evidence cues:
Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Owned scope: `provisioning.capacity-planning`.

Offer: Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Input: `rig-services/infrastructure.provisioning.capacity-planning.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Select an approved repository-owned command to verify that behavior.

minimal: peak requests per second — 100.

mid: headroom percent — 30.

maximal: ignore growth forecast — false.
