# infrastructure.container.service-mesh — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for service mesh; it does not widen ownership beyond container.service-mesh. For service mesh, inspect these context signals: transport_security. Binding checks: service-mesh-container-context.

Start from the existing repository's service mesh convention, then name the source path or command that establishes it. For service mesh, inspect the repository's actual spec, source, test, or configuration for transport_security; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring container services outside the service mesh decision for container.service-mesh.

Acceptance target: fixture:infrastructure.container.service-mesh:repository-context. Given container.service-mesh has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent container concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.
minimal: mesh services — ["api","worker"].
mid: transport security — "mutual-tls".
maximal: allow plaintext fallback — false.
