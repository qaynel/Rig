# infrastructure.container.service-mesh — minimal

Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Policy grade, minimal: List the services that participate in the mesh. A service outside the list is outside the boundary, so enumerate each participant. Binding checks: service-mesh-source-code-boundary.

Acceptance target: policy:infrastructure.container.service-mesh:minimal:service-mesh-source-code-boundary.
Declared predicates: service-mesh-source-code-boundary: `mesh_services` is nonempty (a string or array).
