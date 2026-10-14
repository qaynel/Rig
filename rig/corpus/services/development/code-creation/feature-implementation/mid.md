# development.code-creation.feature-implementation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for feature implementation; it does not widen ownership beyond code-creation.feature-implementation. The context signals are change_scope. Binding checks: feature-implementation-code-creation-context.

Trace the verdict to the existing repository's feature implementation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in code-creation under their own verdicts.

Acceptance target: fixture:development.code-creation.feature-implementation:repository-context. Given code-creation.feature-implementation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code creation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Owned scope: `code-creation.feature-implementation`.

Offer: Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Input: `rig-services/development.code-creation.feature-implementation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Select an approved repository-owned command to verify that behavior.

minimal: acceptance cases — ["creates an item","rejects invalid input"].

mid: change scope — ["src/items.js"].

maximal: compatibility — "preserve-existing-behavior".
