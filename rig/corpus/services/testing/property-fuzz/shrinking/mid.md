# testing.property-fuzz.shrinking — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for shrinking; it does not widen ownership beyond property-fuzz.shrinking. For shrinking, inspect these context signals: preserved_constraints. Binding checks: shrinking-property-fuzz-context.

Inspect the existing repository's shrinking convention, then name the source path or command that establishes it. For shrinking, inspect the repository's actual spec, source, test, or configuration for preserved_constraints; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring property-fuzz services outside the shrinking decision for property-fuzz.shrinking.

Acceptance target: fixture:testing.property-fuzz.shrinking:repository-context. Given property-fuzz.shrinking has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent property fuzz concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.
minimal: failure predicate — "parser crashes".
mid: preserved constraints — ["valid UTF-8"].
maximal: drop failure during shrink — false.
