# infrastructure.container.service-mesh — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for service mesh. It checks mesh_services (nonempty): mesh services must name the concrete repository contract.. Binding checks: service-mesh-source-code-boundary.

Use a repository-owned command or existing native check that can observe container.service-mesh; bind it to the input named in `rig-services/infrastructure.container.service-mesh.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside container.service-mesh is a failure.

Acceptance target: fixture:infrastructure.container.service-mesh:policy-boundary. Given source-code is present and container.service-mesh is selected, pass only when the repository binding evaluates container.service-mesh and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Owned scope: `container.service-mesh`.

Offer: Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Input: `rig-services/infrastructure.container.service-mesh.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: service mesh configuration validation only; declared policy does not prove running service mesh behavior. Select an approved repository-owned command to verify that behavior.

minimal: mesh services — ["api","worker"].

mid: transport security — "mutual-tls".

maximal: allow plaintext fallback — false.
