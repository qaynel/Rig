# infrastructure.container.service-mesh — maximal

Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: service-mesh-source-code-boundary, service-mesh-container-context, service-mesh-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.container.service-mesh:maximal:service-mesh-source-code-boundary+service-mesh-container-context+service-mesh-evidence-receipt.

Declared predicates: service-mesh-source-code-boundary: `mesh_services` is nonempty (a string or array); service-mesh-container-context: `transport_security` is nonempty (a string or array); service-mesh-evidence-receipt: `allow_plaintext_fallback` equals false.
