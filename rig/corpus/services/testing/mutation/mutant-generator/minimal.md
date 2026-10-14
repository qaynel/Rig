# testing.mutation.mutant-generator — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for mutant generator. The minimal boundary for mutant generator checks mutation_operators (nonempty): mutation operators must name the concrete repository contract.. Binding checks: mutant-generator-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe mutation.mutant-generator; bind it to the input named in `rig-services/testing.mutation.mutant-generator.json` and preserve the check's failure status. When adopting this in an existing repository, connect mutant generator to the command that inspects mutation_operators and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside mutation.mutant-generator as a failure.

Acceptance target: fixture:testing.mutation.mutant-generator:policy-boundary. Given source-code is present and mutation.mutant-generator is selected, pass only when the repository binding evaluates mutation.mutant-generator and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. The ceiling is mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Choose a repository-owned check that observes mutant generator from rig-services/testing.mutation.mutant-generator.json..

Service-specific evidence cues:
Offer: Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.
minimal: mutation operators — ["negate conditional"].
mid: target paths — ["src/parser.js"].
maximal: mutate test code — false.
