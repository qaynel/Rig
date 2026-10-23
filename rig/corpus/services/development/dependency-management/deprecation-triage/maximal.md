# development.dependency-management.deprecation-triage — maximal

Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Policy grade, maximal: Set ignoring the removal deadline to false. Suppressing a warning does not stop the dependency disappearing, so track the removal date explicitly. Cumulative with minimal and mid. Binding checks: deprecation-triage-source-code-boundary, deprecation-triage-dependency-management-context, deprecation-triage-evidence-receipt.

Acceptance target: policy:development.dependency-management.deprecation-triage:maximal:deprecation-triage-source-code-boundary+deprecation-triage-dependency-management-context+deprecation-triage-evidence-receipt.
Declared predicates: deprecation-triage-source-code-boundary: `deprecated_apis` is nonempty (a string or array); deprecation-triage-dependency-management-context: `replacement_owners` is nonempty (a string or array); deprecation-triage-evidence-receipt: `ignore_removal_deadline` equals false.
