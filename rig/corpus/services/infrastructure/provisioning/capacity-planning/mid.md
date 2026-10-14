# infrastructure.provisioning.capacity-planning — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for capacity planning; it does not widen ownership beyond provisioning.capacity-planning. For capacity planning, inspect these context signals: headroom_percent. Binding checks: capacity-planning-provisioning-context.

Anchor the review on the existing repository's capacity planning convention, then name the source path or command that establishes it. For capacity planning, inspect the repository's actual spec, source, test, or configuration for headroom_percent; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring provisioning services outside the capacity planning decision for provisioning.capacity-planning.

Acceptance target: fixture:infrastructure.provisioning.capacity-planning:repository-context. Given provisioning.capacity-planning has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent provisioning concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.
minimal: peak requests per second — 100.
mid: headroom percent — 30.
maximal: ignore growth forecast — false.
