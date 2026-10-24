# codegen-scaffolding

Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Owned scope: `code-creation.codegen-scaffolding`. Input: `rig-services/development.code-creation.codegen-scaffolding.json`.

Coverage ceiling: Configuration validation only, so it confirms the generator revision, generated paths and the no-overwrite setting are declared; it does not show that generation preserved hand-written files.

minimal: generator revision — "a1b2c3d". Pin the generator revision. An unpinned generator changes output between runs, so record the exact version or commit.

mid: generated paths — ["generated/client.js"]. List the exact paths the generator owns. Without them hand-written code can be mistaken for generated code, so declare the generated directories or files.

maximal: overwrite user files — false. Set overwrite of user files to false. A generator that overwrites hand-written files destroys work, so require a separate decision before it may.
