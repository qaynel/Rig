# development.code-creation.codegen-scaffolding — behavior-oracle slice

Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Policy grade slice `codegen-scaffolding-slice-behavior-oracle`: Pin the generator revision. An unpinned generator changes output between runs, so record the exact version or commit. Despite its name this slice is not a behavior oracle: it confirms the generator revision, generated paths and the no-overwrite setting are declared; it does not show that generation preserved hand-written files.
