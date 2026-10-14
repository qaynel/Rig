# development.code-quality.code-review — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for code review; it does not widen ownership beyond code-quality.code-review. The context signals are required_reviewers. Binding checks: code-review-code-quality-context.

Tie acceptance to the existing repository's code review convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in code-quality under their own verdicts.

Acceptance target: fixture:development.code-quality.code-review:repository-context. Given code-quality.code-review has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code quality concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Owned scope: `code-quality.code-review`.

Offer: Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Input: `rig-services/development.code-quality.code-review.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: code review configuration validation only; declared policy does not prove running code review behavior. Select an approved repository-owned command to verify that behavior.

minimal: review scope — ["src"].

mid: required reviewers — 1.

maximal: unresolved findings allowed — false.
