# infrastructure.container.service-mesh — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for service mesh. The minimal boundary for service mesh checks mesh_services (nonempty): mesh services must name the concrete repository contract.. Binding checks: service-mesh-source-code-boundary.

Use a repository-owned command or existing native check that can observe container.service-mesh; bind it to the input named in `rig-services/infrastructure.container.service-mesh.json` and preserve the check's failure status. When adopting this in an existing repository, connect service mesh to the command that inspects mesh_services and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside container.service-mesh as a failure.

Acceptance target: fixture:infrastructure.container.service-mesh:policy-boundary. Given source-code is present and container.service-mesh is selected, pass only when the repository binding evaluates container.service-mesh and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern. The ceiling is service mesh configuration validation only; declared policy does not prove running service mesh behavior. Choose a repository-owned check that observes service mesh from rig-services/infrastructure.container.service-mesh.json..

Service-specific evidence cues:
Offer: Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.
minimal: mesh services — ["api","worker"].
mid: transport security — "mutual-tls".
maximal: allow plaintext fallback — false.
