# infrastructure.container.service-mesh — identity

service mesh owns container.service-mesh. Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Keep sibling services in container under their own verdicts. Read the configured input at `rig-services/infrastructure.container.service-mesh.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: service mesh configuration validation only; declared policy does not prove running service mesh behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.container.service-mesh:policy-boundary. Given source-code is present and container.service-mesh is selected, pass only when the repository binding evaluates container.service-mesh and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern.
