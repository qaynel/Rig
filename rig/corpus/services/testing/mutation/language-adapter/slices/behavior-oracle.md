# testing.mutation.language-adapter — behavior-oracle slice

Policy grade slice. This slice bounds language adapter to mutation.language-adapter. It uses `language-adapter-slice-behavior-oracle` and checks source_extensions (nonempty): source extensions must name the concrete repository contract..

For language adapter, choose a repository example that satisfies source_extensions at the behavior-oracle floor, plus a failure where source extensions must name the concrete repository contract. is false. For language adapter, wire `behavior-oracle` to `rig-services/testing.mutation.language-adapter.json` and keep its verdict on source_extensions; missing evidence is a named gap, with ceiling language adapter configuration validation only; declared policy does not prove running language adapter behavior. Choose a repository-owned check that observes language adapter from rig-services/testing.mutation.language-adapter.json..

Service-specific evidence cues:
Offer: Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.
minimal: source extensions — [".js"].
mid: compiler command — ["node","--check"].
maximal: parse errors are success — false.
