# testing.e2e.cross-environment — identity

cross environment owns e2e.cross-environment. Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Keep sibling services in e2e under their own verdicts. Read the configured input at `rig-services/testing.e2e.cross-environment.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: cross environment configuration validation only; declared policy does not prove running cross environment behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.e2e.cross-environment:policy-boundary. Given source-code is present and e2e.cross-environment is selected, pass only when the repository binding evaluates e2e.cross-environment and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern.
