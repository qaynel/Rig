# testing.mutation.language-adapter — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for language adapter; it does not widen ownership beyond mutation.language-adapter. The context signals are compiler_command. Binding checks: language-adapter-mutation-context.

Inspect the existing repository's language adapter convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in mutation under their own verdicts.

Acceptance target: fixture:testing.mutation.language-adapter:repository-context. Given mutation.language-adapter has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Owned scope: `mutation.language-adapter`.

Offer: Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Input: `rig-services/testing.mutation.language-adapter.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: language adapter configuration validation only; declared policy does not prove running language adapter behavior. Select an approved repository-owned command to verify that behavior.

minimal: source extensions — [".js"].

mid: compiler command — ["node","--check"].

maximal: parse errors are success — false.
