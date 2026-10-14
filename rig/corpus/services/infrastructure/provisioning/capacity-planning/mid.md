# infrastructure.provisioning.capacity-planning — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for capacity planning; it does not widen ownership beyond provisioning.capacity-planning. The context signals are headroom_percent. Binding checks: capacity-planning-provisioning-context.

Anchor the review on the existing repository's capacity planning convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in provisioning under their own verdicts.

Acceptance target: fixture:infrastructure.provisioning.capacity-planning:repository-context. Given provisioning.capacity-planning has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent provisioning concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Owned scope: `provisioning.capacity-planning`.

Offer: Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Input: `rig-services/infrastructure.provisioning.capacity-planning.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Select an approved repository-owned command to verify that behavior.

minimal: peak requests per second — 100.

mid: headroom percent — 30.

maximal: ignore growth forecast — false.
