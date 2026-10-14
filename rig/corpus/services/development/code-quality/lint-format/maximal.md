# development.code-quality.lint-format — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for lint format. The evidence must preserve the format_command, lint_command, autofix_during_check inputs that determined the result. Binding checks: lint-format-ci-gate-and-explicit-fix.

Anchor the review on a second run against unchanged lint format inputs. Record the format_command, lint_command, autofix_during_check inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this lint format result is stale. The ceiling remains: lint format configuration validation only; declared policy does not prove running lint format behavior. Choose a repository-owned check that observes lint format from rig-services/development.code-quality.lint-format.json.

Acceptance target: fixture:development.code-quality.lint-format:evidence-replay. Given the development.code-quality.lint-format binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.
minimal: format command — ["npm","run","format:check"].
mid: lint command — ["npm","run","lint"].
maximal: autofix during check — false.
