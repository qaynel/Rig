# infrastructure.container.service-mesh — floor and mutation-floor slice

Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Policy grade slice `service-mesh-slice-floor`: List the services that participate in the mesh. A service outside the list is outside the boundary, so enumerate each participant.
