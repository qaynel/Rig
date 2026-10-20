# infrastructure.container.service-mesh — behavior-oracle slice

Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Policy grade slice. This slice bounds service mesh to container.service-mesh. It uses `service-mesh-slice-behavior-oracle` and checks mesh_services (nonempty): mesh services must name the concrete repository contract.