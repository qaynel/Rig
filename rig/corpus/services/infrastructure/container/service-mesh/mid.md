# infrastructure.container.service-mesh — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for service mesh; it does not widen ownership beyond container.service-mesh. The context signals are transport_security. Binding checks: service-mesh-container-context.

Start from the existing repository's service mesh convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in container under their own verdicts.

Acceptance target: fixture:infrastructure.container.service-mesh:repository-context. Given container.service-mesh has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent container concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Owned scope: `container.service-mesh`.

Offer: Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Input: `rig-services/infrastructure.container.service-mesh.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: service mesh configuration validation only; declared policy does not prove running service mesh behavior. Select an approved repository-owned command to verify that behavior.

minimal: mesh services — ["api","worker"].

mid: transport security — "mutual-tls".

maximal: allow plaintext fallback — false.
