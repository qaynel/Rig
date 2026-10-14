# testing.mutation.equivalent-mutant-detector — identity

equivalent mutant detector owns mutation.equivalent-mutant-detector. Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Keep sibling services in mutation under their own verdicts. Inspect the configured input at `rig-services/testing.mutation.equivalent-mutant-detector.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.equivalent-mutant-detector:policy-boundary. Given source-code is present and mutation.equivalent-mutant-detector is selected, pass only when the repository binding evaluates mutation.equivalent-mutant-detector and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.
