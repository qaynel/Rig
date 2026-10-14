# testing.mutation.mutant-generator — identity

mutant generator owns mutation.mutant-generator. Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Keep sibling services in mutation under their own verdicts. Use the configured input at `rig-services/testing.mutation.mutant-generator.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.mutant-generator:policy-boundary. Given source-code is present and mutation.mutant-generator is selected, pass only when the repository binding evaluates mutation.mutant-generator and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.
