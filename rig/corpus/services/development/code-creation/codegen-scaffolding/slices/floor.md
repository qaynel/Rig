# development.code-creation.codegen-scaffolding — floor and mutation-floor slice

Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Policy grade slice `codegen-scaffolding-slice-floor`: Pin the generator revision. An unpinned generator changes output between runs, so record the exact version or commit.
