# infrastructure.container.service-mesh — property-floor slice

Policy grade slice. This slice bounds service mesh to container.service-mesh. It uses `service-mesh-slice-property-floor` and checks mesh_services (nonempty): mesh services must name the concrete repository contract..

Inspect a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.container.service-mesh.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than service mesh configuration validation only; declared policy does not prove running service mesh behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Owned scope: `container.service-mesh`.

Offer: Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Input: `rig-services/infrastructure.container.service-mesh.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: service mesh configuration validation only; declared policy does not prove running service mesh behavior. Select an approved repository-owned command to verify that behavior.

minimal: mesh services — ["api","worker"].

mid: transport security — "mutual-tls".

maximal: allow plaintext fallback — false.
