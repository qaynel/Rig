# development.architecture.tech-debt — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for tech debt; it does not widen ownership beyond architecture.tech-debt. The context signals are owners. Binding checks: tech-debt-architecture-context.

Read the existing repository's tech debt convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in architecture under their own verdicts.

Acceptance target: fixture:development.architecture.tech-debt:repository-context. Given architecture.tech-debt has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent architecture concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Owned scope: `architecture.tech-debt`.

Offer: Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Input: `rig-services/development.architecture.tech-debt.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Select an approved repository-owned command to verify that behavior.

minimal: debt items — ["replace duplicated parser"].

mid: owners — ["platform"].

maximal: exit criteria — ["single parser with compatibility checks"].
