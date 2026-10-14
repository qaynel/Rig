# development.code-creation.codegen-scaffolding — maximal

Maximal adds a replayable evidence receipt for codegen scaffolding. The evidence must preserve the generator_revision, generated_paths, overwrite_user_files inputs that determined the result.

Trace the verdict to a second run against unchanged codegen scaffolding inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-creation.codegen-scaffolding:evidence-replay. Given the code-creation.codegen-scaffolding binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
