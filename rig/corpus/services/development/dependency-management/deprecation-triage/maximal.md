# development.dependency-management.deprecation-triage — maximal

Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: deprecation-triage-source-code-boundary, deprecation-triage-dependency-management-context, deprecation-triage-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:development.dependency-management.deprecation-triage:maximal:deprecation-triage-source-code-boundary+deprecation-triage-dependency-management-context+deprecation-triage-evidence-receipt.

Declared predicates: deprecation-triage-source-code-boundary: `deprecated_apis` is nonempty (a string or array); deprecation-triage-dependency-management-context: `replacement_owners` is nonempty (a string or array); deprecation-triage-evidence-receipt: `ignore_removal_deadline` equals false.
