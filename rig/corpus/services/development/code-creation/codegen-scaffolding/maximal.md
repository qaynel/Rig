# development.code-creation.codegen-scaffolding — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for codegen scaffolding. The evidence must preserve the generator_revision, generated_paths, overwrite_user_files inputs that determined the result. Binding checks: codegen-scaffolding-evidence-receipt.

Trace the verdict to a second run against unchanged codegen scaffolding inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-creation.codegen-scaffolding:evidence-replay. Given the code-creation.codegen-scaffolding binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Owned scope: `code-creation.codegen-scaffolding`.

Offer: Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Input: `rig-services/development.code-creation.codegen-scaffolding.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Select an approved repository-owned command to verify that behavior.

minimal: generator revision — "a1b2c3d".

mid: generated paths — ["generated/client.js"].

maximal: overwrite user files — false.
