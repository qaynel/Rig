# testing.mutation.language-adapter — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for language adapter. The evidence must preserve the source_extensions, compiler_command, parse_errors_are_success inputs that determined the result. Binding checks: language-adapter-evidence-receipt.

Tie acceptance to a second run against unchanged language adapter inputs. Record the source_extensions, compiler_command, parse_errors_are_success inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this language adapter result is stale. The ceiling remains: language adapter configuration validation only; declared policy does not prove running language adapter behavior. Choose a repository-owned check that observes language adapter from rig-services/testing.mutation.language-adapter.json.

Acceptance target: fixture:testing.mutation.language-adapter:evidence-replay. Given the mutation.language-adapter binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.
minimal: source extensions — [".js"].
mid: compiler command — ["node","--check"].
maximal: parse errors are success — false.
