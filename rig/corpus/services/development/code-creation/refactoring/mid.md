# development.code-creation.refactoring — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for refactoring; it does not widen ownership beyond code-creation.refactoring. The context signals are public_api_changes. Binding checks: refactoring-code-creation-context.

Use the existing repository's refactoring convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in code-creation under their own verdicts.

Acceptance target: fixture:development.code-creation.refactoring:repository-context. Given code-creation.refactoring has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code creation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Owned scope: `code-creation.refactoring`.

Offer: A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Input: `rig-services/development.code-creation.refactoring.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: refactoring configuration validation only; declared policy does not prove running refactoring behavior. Select an approved repository-owned command to verify that behavior.

minimal: preserved behaviors — ["public API returns unchanged values"].

mid: public api changes — 0.

maximal: rollback strategy — "revert-commit".
