# testing.mutation.mutant-generator — behavior-oracle slice

Policy grade slice. This slice bounds mutant generator to mutation.mutant-generator. It uses `mutant-generator-slice-behavior-oracle` and checks mutation_operators (nonempty): mutation operators must name the concrete repository contract..

For mutant generator, choose a repository example that satisfies mutation_operators at the behavior-oracle floor, plus a failure where mutation operators must name the concrete repository contract. is false. For mutant generator, wire `behavior-oracle` to `rig-services/testing.mutation.mutant-generator.json` and keep its verdict on mutation_operators; missing evidence is a named gap, with ceiling mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Choose a repository-owned check that observes mutant generator from rig-services/testing.mutation.mutant-generator.json..

Service-specific evidence cues:
Offer: Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.
minimal: mutation operators — ["negate conditional"].
mid: target paths — ["src/parser.js"].
maximal: mutate test code — false.
