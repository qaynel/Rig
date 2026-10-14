# development.code-creation.codegen-scaffolding — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for codegen scaffolding; it does not widen ownership beyond code-creation.codegen-scaffolding. The context signals are generated_paths. Binding checks: codegen-scaffolding-code-creation-context.

Start from the existing repository's codegen scaffolding convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in code-creation under their own verdicts.

Acceptance target: fixture:development.code-creation.codegen-scaffolding:repository-context. Given code-creation.codegen-scaffolding has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent code creation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Owned scope: `code-creation.codegen-scaffolding`.

Offer: Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Input: `rig-services/development.code-creation.codegen-scaffolding.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Select an approved repository-owned command to verify that behavior.

minimal: generator revision — "a1b2c3d".

mid: generated paths — ["generated/client.js"].

maximal: overwrite user files — false.
