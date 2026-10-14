# development.code-creation.codegen-scaffolding — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for codegen scaffolding. The evidence must preserve the generator_revision, generated_paths, overwrite_user_files inputs that determined the result. Binding checks: codegen-scaffolding-evidence-receipt.

Trace the verdict to a second run against unchanged codegen scaffolding inputs. Record the generator_revision, generated_paths, overwrite_user_files inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this codegen scaffolding result is stale. The ceiling remains: codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Choose a repository-owned check that observes codegen scaffolding from rig-services/development.code-creation.codegen-scaffolding.json.

Acceptance target: fixture:development.code-creation.codegen-scaffolding:evidence-replay. Given the code-creation.codegen-scaffolding binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.
minimal: generator revision — "a1b2c3d".
mid: generated paths — ["generated/client.js"].
maximal: overwrite user files — false.
