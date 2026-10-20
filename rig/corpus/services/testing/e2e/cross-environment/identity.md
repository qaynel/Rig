# testing.e2e.cross-environment — identity

Policy grade: cross environment owns e2e.cross-environment. Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Keep neighboring e2e services outside the cross environment decision for e2e.cross-environment. Read the configured input at `rig-services/testing.e2e.cross-environment.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: cross environment configuration validation only; declared policy does not prove running cross environment behavior. Choose a repository-owned check that observes cross environment from rig-services/testing.e2e.cross-environment.json.

Acceptance target: policy:testing.e2e.cross-environment:minimal:cross-environment-source-code-boundary.

Declared predicates: cross-environment-source-code-boundary: `environments` is nonempty (a string or array).
