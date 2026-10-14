# testing.mutation.language-adapter — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for language adapter. The evidence must preserve the source_extensions, compiler_command, parse_errors_are_success inputs that determined the result. Binding checks: language-adapter-evidence-receipt.

Tie acceptance to a second run against unchanged language adapter inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: language adapter configuration validation only; declared policy does not prove running language adapter behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.language-adapter:evidence-replay. Given the mutation.language-adapter binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Owned scope: `mutation.language-adapter`.

Offer: Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Input: `rig-services/testing.mutation.language-adapter.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: language adapter configuration validation only; declared policy does not prove running language adapter behavior. Select an approved repository-owned command to verify that behavior.

minimal: source extensions — [".js"].

mid: compiler command — ["node","--check"].

maximal: parse errors are success — false.
