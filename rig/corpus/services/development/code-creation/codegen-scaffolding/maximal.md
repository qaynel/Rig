# development.code-creation.codegen-scaffolding — maximal

Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: codegen-scaffolding-source-code-boundary, codegen-scaffolding-code-creation-context, codegen-scaffolding-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.code-creation.codegen-scaffolding:maximal:codegen-scaffolding-source-code-boundary+codegen-scaffolding-code-creation-context+codegen-scaffolding-evidence-receipt.

Declared predicates: codegen-scaffolding-source-code-boundary: `generator_revision` is nonempty (a string or array); codegen-scaffolding-code-creation-context: `generated_paths` is nonempty (a string or array); codegen-scaffolding-evidence-receipt: `overwrite_user_files` equals false.
