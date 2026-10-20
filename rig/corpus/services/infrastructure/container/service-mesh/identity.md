# infrastructure.container.service-mesh — identity

Policy grade: service mesh owns container.service-mesh. Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Keep neighboring container services outside the service mesh decision for container.service-mesh. Read the configured input at `rig-services/infrastructure.container.service-mesh.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: service mesh configuration validation only; declared policy does not prove running service mesh behavior. Choose a repository-owned check that observes service mesh from rig-services/infrastructure.container.service-mesh.json.

Acceptance target: policy:infrastructure.container.service-mesh:minimal:service-mesh-source-code-boundary.

Declared predicates: service-mesh-source-code-boundary: `mesh_services` is nonempty (a string or array).
