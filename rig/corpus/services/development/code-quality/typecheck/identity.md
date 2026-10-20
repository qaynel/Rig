# development.code-quality.typecheck — identity

Policy grade: typecheck owns code-quality.typecheck. Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Keep neighboring code-quality services outside the typecheck decision for code-quality.typecheck. Read the configured input at `rig-services/development.code-quality.typecheck.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: typecheck configuration validation only; declared policy does not prove running typecheck behavior. Choose a repository-owned check that observes typecheck from rig-services/development.code-quality.typecheck.json.

Acceptance target: policy:development.code-quality.typecheck:minimal:typecheck-source-code-boundary.

Declared predicates: typecheck-source-code-boundary: `typecheck_command` is nonempty (a string or array).
