# infrastructure.container.service-mesh — identity

Policy grade: service-mesh owns container.service-mesh. Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Input: `rig-services/infrastructure.container.service-mesh.json`. Configuration validation only, so it confirms mesh services, transport security and the plaintext-fallback flag are declared; it does not show traffic is actually encrypted.

Disposition: executable.
Acceptance target: policy:infrastructure.container.service-mesh:minimal:service-mesh-source-code-boundary.
Declared predicates: service-mesh-source-code-boundary: `mesh_services` is nonempty (a string or array).
