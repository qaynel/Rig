# testing.mutation.language-adapter — floor and mutation-floor slice

Policy grade slice. This slice bounds language adapter to mutation.language-adapter. It uses `language-adapter-slice-floor` and checks source_extensions (nonempty): source extensions must name the concrete repository contract..

Use a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.language-adapter.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than language adapter configuration validation only; declared policy does not prove running language adapter behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Owned scope: `mutation.language-adapter`.

Offer: Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Input: `rig-services/testing.mutation.language-adapter.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: language adapter configuration validation only; declared policy does not prove running language adapter behavior. Select an approved repository-owned command to verify that behavior.

minimal: source extensions — [".js"].

mid: compiler command — ["node","--check"].

maximal: parse errors are success — false.
