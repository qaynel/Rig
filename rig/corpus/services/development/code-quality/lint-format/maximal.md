# development.code-quality.lint-format — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for lint format. The evidence must preserve the format_command, lint_command, autofix_during_check inputs that determined the result. Binding checks: lint-format-ci-gate-and-explicit-fix.

Anchor the review on a second run against unchanged lint format inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: lint format configuration validation only; declared policy does not prove running lint format behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-quality.lint-format:evidence-replay. Given the development.code-quality.lint-format binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Owned scope: `code-quality.lint-format`.

Offer: Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Input: `rig-services/development.code-quality.lint-format.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: lint format configuration validation only; declared policy does not prove running lint format behavior. Select an approved repository-owned command to verify that behavior.

minimal: format command — ["npm","run","format:check"].

mid: lint command — ["npm","run","lint"].

maximal: autofix during check — false.
