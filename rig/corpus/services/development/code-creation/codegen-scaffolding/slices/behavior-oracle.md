# development.code-creation.codegen-scaffolding — behavior-oracle slice

Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Policy grade slice. This slice bounds codegen scaffolding to code-creation.codegen-scaffolding. It uses `codegen-scaffolding-slice-behavior-oracle` and checks generator_revision (nonempty): generator revision must name the concrete repository contract.