# testing.mutation.language-adapter — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for language adapter. It checks source_extensions (nonempty): source extensions must name the concrete repository contract.. Binding checks: language-adapter-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe mutation.language-adapter; bind it to the input named in `rig-services/testing.mutation.language-adapter.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.language-adapter is a failure.

Acceptance target: fixture:testing.mutation.language-adapter:policy-boundary. Given source-code is present and mutation.language-adapter is selected, pass only when the repository binding evaluates mutation.language-adapter and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Owned scope: `mutation.language-adapter`.

Offer: Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Input: `rig-services/testing.mutation.language-adapter.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: language adapter configuration validation only; declared policy does not prove running language adapter behavior. Select an approved repository-owned command to verify that behavior.

minimal: source extensions — [".js"].

mid: compiler command — ["node","--check"].

maximal: parse errors are success — false.
