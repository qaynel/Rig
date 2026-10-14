# testing.property-fuzz.shrinking — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for shrinking; it does not widen ownership beyond property-fuzz.shrinking. The context signals are preserved_constraints. Binding checks: shrinking-property-fuzz-context.

Inspect the existing repository's shrinking convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in property-fuzz under their own verdicts.

Acceptance target: fixture:testing.property-fuzz.shrinking:repository-context. Given property-fuzz.shrinking has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent property fuzz concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Owned scope: `property-fuzz.shrinking`.

Offer: Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Input: `rig-services/testing.property-fuzz.shrinking.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: shrinking configuration validation only; declared policy does not prove running shrinking behavior. Select an approved repository-owned command to verify that behavior.

minimal: failure predicate — "parser crashes".

mid: preserved constraints — ["valid UTF-8"].

maximal: drop failure during shrink — false.
