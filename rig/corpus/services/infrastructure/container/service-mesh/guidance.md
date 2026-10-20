# service-mesh

Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Owned scope: `container.service-mesh`. Input: `rig-services/infrastructure.container.service-mesh.json`.

Coverage ceiling: Configuration validation only, so it confirms mesh services, transport security and the plaintext-fallback flag are declared; it does not show traffic is actually encrypted.

minimal: mesh services — ["api","worker"]. List the services that participate in the mesh. A service outside the list is outside the boundary, so enumerate each participant.

mid: transport security — "mutual-tls". Declare the transport security mode, such as mutual TLS. Without it service traffic may be unauthenticated, so state the required mode.

maximal: allow plaintext fallback — false. Set allowing plaintext fallback to false. A silent downgrade undermines the declared boundary, so reject unencrypted connections.
