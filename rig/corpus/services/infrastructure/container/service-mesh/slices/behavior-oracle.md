# infrastructure.container.service-mesh — behavior-oracle slice

Policy grade slice. This slice bounds service mesh to container.service-mesh. It uses `service-mesh-slice-behavior-oracle` and checks mesh_services (nonempty): mesh services must name the concrete repository contract..

For service mesh, choose a repository example that satisfies mesh_services at the behavior-oracle floor, plus a failure where mesh services must name the concrete repository contract. is false. For service mesh, wire `behavior-oracle` to `rig-services/infrastructure.container.service-mesh.json` and keep its verdict on mesh_services; missing evidence is a named gap, with ceiling service mesh configuration validation only; declared policy does not prove running service mesh behavior. Choose a repository-owned check that observes service mesh from rig-services/infrastructure.container.service-mesh.json..

Service-specific evidence cues:
Offer: Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.
minimal: mesh services — ["api","worker"].
mid: transport security — "mutual-tls".
maximal: allow plaintext fallback — false.
