# infrastructure.container.service-mesh — minimal

Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for service mesh. The minimal boundary for service mesh checks mesh_services (nonempty): mesh services must name the concrete repository contract. Binding checks: service-mesh-source-code-boundary.

Use a repository-owned command or existing native check that can observe container.service-mesh; bind it to the input named in `rig-services/infrastructure.container.service-mesh.json` and preserve the check's failure status. When adopting this in an existing repository, connect service mesh to the command that inspects mesh_services and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside container.service-mesh as a failure.

Acceptance target: policy:infrastructure.container.service-mesh:minimal:service-mesh-source-code-boundary.

Declared predicates: service-mesh-source-code-boundary: `mesh_services` is nonempty (a string or array).
