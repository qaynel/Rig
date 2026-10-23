# testing.e2e.cross-environment — identity

Policy grade: cross-environment owns e2e.cross-environment. Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Input: `rig-services/testing.e2e.cross-environment.json`. Configuration validation only, so it confirms environments, shared cases and the platform-equivalence flag are declared; it does not run on any platform.

Disposition: executable.
Acceptance target: policy:testing.e2e.cross-environment:minimal:cross-environment-source-code-boundary.
Declared predicates: cross-environment-source-code-boundary: `environments` is nonempty (a string or array).
