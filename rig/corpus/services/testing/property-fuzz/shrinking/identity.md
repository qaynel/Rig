# testing.property-fuzz.shrinking — identity

Policy grade: shrinking owns property-fuzz.shrinking. Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Keep neighboring property-fuzz services outside the shrinking decision for property-fuzz.shrinking. Start from the configured input at `rig-services/testing.property-fuzz.shrinking.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: shrinking configuration validation only; declared policy does not prove running shrinking behavior. Choose a repository-owned check that observes shrinking from rig-services/testing.property-fuzz.shrinking.json.

Acceptance target: policy:testing.property-fuzz.shrinking:minimal:shrinking-source-code-boundary.

Declared predicates: shrinking-source-code-boundary: `failure_predicate` is nonempty (a string or array).
