# development.code-creation.codegen-scaffolding — maximal

Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Policy grade, maximal: Set overwrite of user files to false. A generator that overwrites hand-written files destroys work, so require a separate decision before it may. Cumulative with minimal and mid. Binding checks: codegen-scaffolding-source-code-boundary, codegen-scaffolding-code-creation-context, codegen-scaffolding-evidence-receipt.

Acceptance target: policy:development.code-creation.codegen-scaffolding:maximal:codegen-scaffolding-source-code-boundary+codegen-scaffolding-code-creation-context+codegen-scaffolding-evidence-receipt.
Declared predicates: codegen-scaffolding-source-code-boundary: `generator_revision` is nonempty (a string or array); codegen-scaffolding-code-creation-context: `generated_paths` is nonempty (a string or array); codegen-scaffolding-evidence-receipt: `overwrite_user_files` equals false.
