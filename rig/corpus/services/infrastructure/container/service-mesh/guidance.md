# service mesh

Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Owned scope: `container.service-mesh`.

Offer: Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Input: `rig-services/infrastructure.container.service-mesh.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: service mesh configuration validation only; declared policy does not prove running service mesh behavior. Select an approved repository-owned command to verify that behavior.

minimal: mesh services — ["api","worker"].

mid: transport security — "mutual-tls".

maximal: allow plaintext fallback — false.
