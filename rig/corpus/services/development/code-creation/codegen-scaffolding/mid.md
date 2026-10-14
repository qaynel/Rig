# development.code-creation.codegen-scaffolding — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for codegen scaffolding; it does not widen ownership beyond code-creation.codegen-scaffolding. For codegen scaffolding, inspect these context signals: generated_paths. Binding checks: codegen-scaffolding-code-creation-context.

Start from the existing repository's codegen scaffolding convention, then name the source path or command that establishes it. For codegen scaffolding, inspect the repository's actual spec, source, test, or configuration for generated_paths; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring code-creation services outside the codegen scaffolding decision for code-creation.codegen-scaffolding.

Acceptance target: fixture:development.code-creation.codegen-scaffolding:repository-context. Given code-creation.codegen-scaffolding has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code creation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.
minimal: generator revision — "a1b2c3d".
mid: generated paths — ["generated/client.js"].
maximal: overwrite user files — false.
