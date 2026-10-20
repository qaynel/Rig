# infrastructure.container.service-mesh — behavior-oracle slice

Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Policy grade slice `service-mesh-slice-behavior-oracle`: List the services that participate in the mesh. A service outside the list is outside the boundary, so enumerate each participant. Despite its name this slice is not a behavior oracle: it confirms mesh services, transport security and the plaintext-fallback flag are declared; it does not show traffic is actually encrypted.
